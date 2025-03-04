---
title: Conditional Logic and Dynamic Texts | SurveyJS
description: Learn how to implement branching and skip logic and add dynamic texts to your surveys.
---
# Conditional Logic and Dynamic Texts

This help topic describes how to implement custom conditional logic and add dynamic texts to your survey. Refer to the following sections for details:

- [Dynamic Texts](#dynamic-texts)
  - [Question Values](#question-values)
  - [Variables](#variables)
  - [Calculated Values](#calculated-values)
- [Expressions](#expressions)
  - [Built-In Functions](#built-in-functions)
  - [Custom Functions](#custom-functions)
    - [Implement a Custom Function](#implement-a-custom-function)
    - [Access Survey Elements Within a Custom Function](#access-survey-elements-within-a-custom-function)
    - [Asynchronous Functions](#asynchronous-functions)
- [Conditional Visibility](#conditional-visibility)
  - [Question Visibility](#question-visibility)
  - [Item Visibility (Choices, Columns, Rows)](#item-visibility-choices-columns-rows)
    - [Specify Visibility Conditions for Individual Items](#specify-visibility-conditions-for-individual-items)
    - [Combine Visibility Conditions](#combine-visibility-conditions)
- [Conditional Survey Logic (Triggers)](#conditional-survey-logic-triggers)

## Dynamic Texts

Survey UI texts support placeholders whose values are computed at runtime to make the texts dynamic. Placeholders can be used in the following places:

- Titles and descriptions of surveys, pages, panels, and questions
- Properties that accept HTML markup ([`completedHtml`](https://surveyjs.io/Documentation/Library?id=surveymodel#completedHtml), [`loadingHtml`](https://surveyjs.io/Documentation/Library?id=surveymodel#loadingHtml), etc.)
- [Expressions](#expressions)

You can use the following values as placeholders:

- [Question Values](#question-values)
- [Variables](#variables)
- [Calculated Values](#calculated-values)

### Question Values

To use a question value as a placeholder, specify the question's [`name`](https://surveyjs.io/Documentation/Library?id=Question#name) in curly brackets. The name will be replaced with the question value. For instance, the following example defines two [Text](https://surveyjs.io/Documentation/Library?id=questiontextmodel) questions: First Name and Last Name. An [Html](https://surveyjs.io/Documentation/Library?id=questionhtmlmodel) question uses their `name` property to reference them and display their values:

```js
const surveyJson = {
  "elements": [
    { "name": "firstName", "type": "text", "title": "First Name", "defaultValue": "John" },
    { "name": "lastName", "type": "text", "title": "Last Name", "defaultValue": "Smith" },
    {
      "name": "greetings",
      "type": "html",
      "html": "<p>Hello, {firstName} {lastName}!</p>"
    }
  ]
};
```

Certain question types can contain multiple values. Use a dot symbol to access a specific value (item or cell):

| Question Type | Syntax |
| ------------- | ------ |
| [Multiple Text](/Documentation/Library?id=questionmultipletextmodel) | `{questionname.itemname}` |
| [Matrix](/Documentation/Library?id=questionmatrixmodel) | `{questionname.rowname}` |
| [Matrix Dropdown](/Documentation/Library?id=questionmatrixdropdownmodel) | `{questionname.rowname.columnname}` |

[View the "Complex Questions in Expressions" Demo](/Examples/Library?id=condition-complexquestions (linkStyle))

In dynamic questions, use a zero-based index to access a specific value (question or cell):

| Question Type | Syntax |
| ------------- | ------ |
| [Panel Dynamic](/Documentation/Library?id=questionpaneldynamicmodel) | `{dynamicpanelname[index].questionname}` |
| [Matrix Dynamic](/Documentation/Library?id=questionmatrixdynamicmodel) | `{dynamicmatrixname[rowindex].columnname}` |

In addition, Matrix questions support a `row` prefix that allows you to access cells on the same row: `{row.columnname}`. Similarly, you can use a `panel` prefix to access questions in the same Panel: `{panel.questionName}`.

[View the "Conditions in Dynamic Questions" Demo](/Examples/Library?id=condition-dynamic (linkStyle))

### Variables

Variables are used to store JavaScript-calculated values. To create or change a variable, call the Survey's [`setVariable(name, value)`](https://surveyjs.io/Documentation/Library?id=surveymodel#setVariable) method. In the following code, this method sets a `currentYear` variable used to display the current year in an Html question:

```js
import { Model } from "survey-core";

const surveyJson = {
  "elements": [{
    "name": "footer",
    "type": "html",
    "html": "&copy; 2015-{currentyear} Devsoft Baltic OÜ"
  }]
};

const survey = new Model(surveyJson);

survey.setVariable("currentyear", new Date().getFullYear());
```

If you need to get a variable's value, call the [`getVariable(name)`](https://surveyjs.io/Documentation/Library?id=surveymodel#getVariable) method. For example, the following code outputs the `currentyear` variable's value into the browser's console:

```js
console.log(survey.getVariable("currentyear"));
```

You can also call the [`getVariableNames()`](https://surveyjs.io/Documentation/Library?id=surveymodel#getVariableNames) method to get a list of all available variables:

```js
console.log(survey.getVariableNames()); // Outputs [ "currentyear" ]
```

### Calculated Values

Calculated values allow you to register an [expression](#expressions) under a required name. If the expression includes [questions](#question-values), [variables](#variables), or [functions](#built-in-functions), it is recalculated each time their values are changed.

To configure a calculated value, define the [`calculatedValues`](https://surveyjs.io/Documentation/Library?id=surveymodel#calculatedValues) array in the survey JSON schema. Each object in this array should contain the following fields:

- `name` - A name that identifies the calculated value.
- `expression` - An expression that returns the calculated value.
- `includeIntoResult` - A Boolean property that specifies whether to include the calculated value in survey results.

The following code shows how to calculate a full name value based on the first and last names:

```js
const surveyJson = {
  "elements": [
    { "name": "firstName", "type": "text", "title": "First Name", "defaultValue": "John" },
    { "name": "lastName", "type": "text", "title": "Last Name", "defaultValue": "Smith" },
    {
      "name": "greetings",
      "type": "html",
      "html": "<p>Hello, {fullname}!</p>"
    }
  ],
  "calculatedValues": [{
    "name": "fullname",
    "expression": "{firstName} +  ' ' + {lastName}"
  }]
};
```

[View the "Use Calculated Values" Demo](https://surveyjs.io/Examples/Library?id=survey-calculatedvalues (linkStyle))

## Expressions

Expressions allow you to add logic to your survey and perform calculations right in the survey JSON schema. Expressions are evaluated and re-evaluated at runtime.

SurveyJS supports the following expression types:

- **String expression**   
  An expression that evaluates to a string value. The following string expression evaluates to `"Adult"` if the [`age`](#age) function returns a value of 21 or higher; otherwise, the expression evaluates to `"Minor"`:

    ```js
    "expression": "iif(age({birthdate}) >= 21, 'Adult', 'Minor')"
    ```

- **Numeric expression**    
  An expression that evaluates to a number. The following numeric expression evaluates to the sum of the `total1` and `total2` question values:

    ```js
    "expression": "sum({total1}, {total2})"
    ```

- **Boolean expression**    
  An expression that evaluates to `true` or `false`. Boolean expressions are widely used to implement conditional logic. Refer to the following help topic for more information: [Conditional Visibility](#conditional-visibility).

Expressions can include question names, variables, and calculated values (described in the [Dynamic Texts](#dynamic-texts) section). Plus, expressions can use [built-in](#built-in-functions) and [custom functions](#custom-functions).

### Built-In Functions

Functions allow you to perform additional calculations within an expression. One expression can contain multiple function calls.

Functions can accept arguments. For example, the following expression shows the built-in [`age`](#age) and [`iif`](#iif) functions. `age` accepts the value of a `birthdate` question. `iif` accepts three arguments: a condition, a value to return when the condition is truthy, and a value to return when the condition is falsy.

```js
"expression": "iif(age({birthdate}) >= 21, 'Adult', 'Minor')"
```

The following built-in functions are available:

- [`iif`](#iif)
- [`isContainerReady`](#iscontainerready)
- [`isDisplayMode`](#isdisplaymode)
- [`age`](#age)
- [`currentDate`](#currentdate)
- [`today`](#today)
- [`getDate`](#getdate)
- [`diffDays`](#diffdays)
- [`sum`](#sum)
- [`max`](#max)
- [`min`](#min)
- [`avg`](#avg)
- [`sumInArray`](#suminarray)
- [`maxInArray`](#maxinarray)
- [`minInArray`](#mininarray)
- [`avgInArray`](#avginarray)
- [`countInArray`](#countinarray)

If you do not find a required function in the list above, you can [implement a custom function](#custom-functions) with the required functionality.

---

#### `iif`

*Definition*: `iif(condition: expression, valueIfTrue: any, valueIfFalse: any): any`

Returns the `valueIfTrue` value if the `condition` is truthy or the `valueIfFalse` value if the `condition` is falsy.

*Example*: `"expression": "iif({question1} + {question2} > 20, 'High', 'Low')"`

[View implementation](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L205-L209)

---

#### `isContainerReady`

*Definition*: `isContainerReady(nameOfPanelOrPage: string): Boolean`

Returns `true` if all questions in a given panel or page have valid input; otherwise, returns `false`. An empty question value is considered valid if neither validators nor required status is defined for it.

*Example*: `"expression": "isContainerReady('page1')"`

[View implementation](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L232-L245)

---

#### `isDisplayMode`

*Definition*: `isDisplayMode(): Boolean`

Returns `true` if the survey is in display or preview mode.

*Example*: `"expression": "isDisplayMode()"` 

[View implementation](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L247-L250)  

---

#### `age`

*Definition*: `age(birthdate: any): number`  

Returns age according to a given birthdate. The date argument (which is typically taken from a question) should be defined as a valid [JavaScript Date](https://www.w3schools.com/jsref/jsref_obj_date.asp).

*Example*: `"expression": "age({birthdate})"`

[View implementation](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L218-L230)  

---

#### `currentDate`

*Definition*: `currentDate(): Date`

Returns the current date and time. 

*Example*: `"expression": "currentDate()"`

[View implementation](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L252-L255)  

---

#### `today`

*Definition*: `today(daysToAdd?: number): Date`

Returns the current date or a date shifted from the current by a given number of days. For example, `today()` returns the current date, 0 hours, 0 minutes, 0 seconds; `today(-1)` returns yesterday's date, same time; `today(1)` returns tomorrow's date, same time.

*Examples*:

- `"expression": "today()"`
- `"expression": "today(2)"`

[View implementation](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L257-L264)  

---

#### `getDate`

*Definition*: `getDate(questionName: expression): Date`

Returns a Date value converted from a given question's value.

*Example*: `"expression": "getDate({birthdate})"`

[View implementation](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L211-L216)  

---

#### `diffDays`

*Definition*: `diffDays(fromDate: any, toDate: any): number`
 
Returns the number of days between two given dates.

*Example*: `"expression": "diffDays({startDate}, {endDate}) < 7"`

[View implementation](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L266-L274)

---

#### `sum`

*Definition*: `sum(param1: number, param2: number, ...): number`  

Returns the sum of passed numbers.

*Example*: `"expression": "sum({total1}, {total2})"`

[View implementation](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L247-L250)

---

#### `max`

*Definition*: `max(param1: number, param2: number, ...): number`
 
Returns the maximum of passed numbers.

*Example*: `"expression": "max({total1}, {total2})"`

[View implementation](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L106-L109)

---

#### `min`

*Definition*: `min(par1: number, par2: number, ...): number`

Returns the minimum of passed numbers.

*Example*: `"expression": "min({total1}, {total2})"`

[View implementation](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L101-L104)

---

#### `avg`

*Definition*: `avg(par1: number, par2: number, ...): number`

Returns the average of passed numbers.

*Example*: `"expression": "avg({total1}, {total2}, {total3})"`

[View implementation](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L118-L127)

---

#### `sumInArray`

*Definition*: `sumInArray(questionName: expression, propertyName: string): number`

Returns the sum of numbers in an array taken from a given question property.

*Example*: `"expression": "sumInArray({matrixdynamic1}, 'total') > 1000"`

[View implementation](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L164-L171) | [View example](https://surveyjs.io/Examples/Library?id=questiontype-expression#content-js)

---

#### `maxInArray`

*Definition*: `maxInArray(questionName: expression, propertyName: string): number`

Returns the maximum of numbers in an array taken from a given question property.

*Example*: `"expression": "maxInArray({matrixdynamic4}, 'quantity') > 20"`

[View implementation](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L181-L187)

---

#### `minInArray`

*Definition*: `minInArray(questionName: expression, propertyName: string): number`
 
Returns the minimum of numbers in an array taken from a given question property.

*Example*: `"expression": "minInArray({matrixdynamic3}, 'quantity') > 5"`

[View implementation](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L173-L179)

---

#### `avgInArray`

*Definition*: `avgInArray(questionName: expression, propertyName: string): number`

Returns the average of numbers in an array taken from a given question property.

*Example*: `"expression": "avgInArray({matrixdynamic2}, 'quantity') > 10"`

[View implementation](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L198-L203)  

---

#### `countInArray`

*Definition*: `countInArray(questionName: expression, propertyName: string): number`

Returns the total number of items in an array taken from a given question property.

*Example*: `"expression": "countInArray({matrixdynamic5}) > 10"`

[View implementation](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L189-L196)

### Custom Functions

In addition to [built-in functions](#built-in-functions), expressions can use custom functions. They allow you to extend the functionality of your survey. 

#### Implement a Custom Function

Your custom function must accept only one array-like parameter that will contain all the passed arguments. For example, the following code passes two arguments to a custom function `myFunc`:

```js
"expression": "myFunc({question1}, {question2})"
```

However, the `myFunc` implementation must accept only one parameter&mdash;an array that contains all arguments:

```js
function myFunc(params) {
  let q1_value = params[0];
  let q2_value = params[1];
  // ...
  return someValue;
}
```

After you implement a custom function, register it in `FunctionFactory`:

```js
import { FunctionFactory } from "survey-core";

FunctionFactory.Instance.register("myFunc", myFunc);
```

For illustrative purposes, the code below shows the built-in `age` function implementation:

```js
import { FunctionFactory } from "survey-core";

// Accepts a birthdate and returns the current age in full years
function age(params: any[]): any {
  if (!params && params.length < 1) return null;
  if (!params[0]) return null;
  var birthDate = new Date(params[0]);
  var today = new Date();
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age -= age > 0 ? 1 : 0;
  }
  return age;
}
// Register the `age` function under the `age` alias
FunctionFactory.Instance.register("age", age);
```

[View source code on GitHub](https://github.com/surveyjs/survey-library/blob/68eb0054dc83d2f45a6daa1042bf7440c8faf007/src/functionsfactory.ts#L218-L230)
[View the "Use custom function in expressions" Demo](https://surveyjs.io/form-library/examples/condition-customfunctions/ (linkStyle))
#### Access Survey Elements Within a Custom Function

You can access any survey element via a [survey instance](https://surveyjs.io/Documentation/Library?id=surveymodel). Use the `this.survey` property to get the survey instance within your custom function implementation. This property allows you to design your function so that it accepts a survey element name as a parameter:

```js
"expression": "myFunc('questionName')"
```

Within the function implementation, you can use the passed name to get the instance of the corresponding element:

```js
function myFunc(params) {
  const questionInstance = this.survey.getQuestionByName(params[0]);
  // ...
}
```

#### Asynchronous Functions

If an expression requires time-consuming calculations or a request to a server, implement an asynchronous custom function. The following code shows an example of an asynchronous function:

```js
function asyncFunc(params: any[]): any {
  setTimeout(() => {
    // Return the function result via the callback
    this.returnResult(yourValue);
  }, 100);
}
```

After you implement an asynchronous function, register it in `FunctionFactory`. The third parameter specifies if this function is asynchronous:

```js
import { FunctionFactory } from "survey-core";

FunctionFactory.Instance.register("asyncFunc", asyncFunc, true);
```

[View the "Async Function in Expression" Demo](https://surveyjs.io/Examples/Library?id=questiontype-expression-async (linkStyle))

## Conditional Visibility

You can specify whether an individual survey element is visible, read-only, or required based on a condition. This functionality is built upon Boolean expressions. Such expressions evaluate to `true` or `false`.

A survey parses and runs all expressions on startup. If a Boolean expression evaluates to `false`, the corresponding element becomes invisible (or read-only, or optional); if it evaluates to `true`, the element becomes visible (or enabled, or required). After any value used in an expression changes, the survey re-evaluates this expression.

The following table shows examples of Boolean expressions:

| Expression | Description |
| ---------- | ----------- |
| `"{age} >= 21"` | Evaluates to `true` if the `"age"` question has a value of 21 or higher. |
| `"({rank1} + {rank2} + {rank3}) > 21 and {isLoyal} = 'yes'"`  | The `or` and `and` operators combine two or more conditions. |
| `"!({isLoyal} = 'yes' and ({rank1} + {rank2} + {rank3}) > 21)"` | The `!` or `not` operator reverts the result. |
| `"{name} notempty"` | Evaluates to `true` if the `"name"` question has any value. |
| `"{name} empty"` | Evaluates to `true` if the `"name"` question has no value. |
| `"{speakinglanguages} = ['English', 'Spanish']"` | Evaluates to `true` if strictly English and Spanish are selected in the `"speakinglanguages"` question. If one of the languages is not selected or other languages are selected too, the expression evaluates to `false`. |
| `"{speakinglanguages} contains 'Spanish'"` | Evaluates to `true` if Spanish is selected. Other languages may or may not be selected. |
| `"age({birthdate}) >= 21"` | Evaluates to `true` if the `age` function returns 21 or higher. |

You should use different properties to specify the visibility of [questions](#question-visibility) and [items (choices, rows, columns)](#item-visibility-choices-columns-rows).

### Question Visibility

Assign Boolean expressions to the [visibleIf](https://surveyjs.io/Documentation/Library?id=Question#visibleIf), [enableIf](https://surveyjs.io/Documentation/Library?id=Question#enableIf), and [requiredIf](https://surveyjs.io/Documentation/Library?id=Question#requiredIf) properties of questions, panels, and pages. In the following example, the `visibleIf` property is used to hide the `drivers-license` question for respondents under 16 years old:

```js
const surveyJson = {
  "elements": [{
    "name": "birthdate"
  }, {
    "name": "drivers-license",
    "title": "Have you got a driver's license?",
    "visibleIf": "age({birthdate}) >= 16"
  }]
}
```

If you do not specify the `visibleIf`, `enableIf`, and `requiredIf` properties, an element's state depends on the [`isVisible`](/Documentation/Library?id=Question#isVisible), [`isReadOnly`](/Documentation/Library?id=Question#isReadOnly), and [`isRequired`](/Documentation/Library?id=Question#isRequired) properties. You can specify them at design time or use them to get or set the current state at runtime. If you set one of these properties for a panel or page, all nested questions inherit the setting.

[View the "Conditional Visibility" Demo](/Examples/Library?id=condition-kids (linkStyle))
[View the "Enable/Disable Elements" Demo](/Examples/Library?id=condition-enable-kids (linkStyle))

### Item Visibility (Choices, Columns, Rows)

SurveyJS allows you to control available choices, columns, and rows based on previous answers.

#### Specify Visibility Conditions for Individual Items

Individual items (choices, columns, rows) can be configured with objects. Each object can have a `visibleIf` property that accepts an expression. When the expression evaluates to `true`, the associated item becomes visible.

In the following code, the `SMS` and `WhatsApp` choices are visible only if a user has entered their phone number:

```js
const surveyJson = {
  "elements": [{
    "name": "Contacts"
    "choices": [
      "Email",
      { "value": "SMS", "visibleIf": "{phone} notempty" },
      { "value": "WhatsApp", "visibleIf": "{phone} notempty" }
    ]
  },
  // ...
  ]
}
```

[View Demo](https://surveyjs.io/Examples/Library?id=condition-choicesVisibleIf (linkStyle))

This technique has one drawback: if a question contains many items, you have to copy the same expression into every item that should have dynamic visibility. If that is your case, use the technique described in the next topic.

#### Combine Visibility Conditions

You can specify one expression that will run against every item (choice, row, column). If the expression evaluates to `true`, the item becomes visible. Assign your expression to the [`choicesVisibleIf`](/Documentation/Library?id=QuestionSelectBase#choicesVisibleIf), [`rowsVisibleIf`](/Documentation/Library?id=questionmatrixmodel#rowsVisibleIf), or [`columnsVisibleIf`](/Documentation/Library?id=questionmatrixmodel#columnsVisibleIf) property. To access the current item, use the `{item}` operand.

The following code shows how to specify the `choicesVisibleIf` property. `choices` in the `"default"` question are filtered based on the `"installed"` question. `choices` in the `"secondChoice"` question depend on both the `"installed"` and `"default"` questions.

```js
const surveyJson = {
  "elements": [{
    "name": "installed",
    "choices": ["Chrome", "MS Edge", "FireFox", "Internet Explorer", "Safari", "Opera"],
    // ...
  }, {
    "name": "default",
    "choices": ["Chrome", "MS Edge", "FireFox", "Internet Explorer", "Safari", "Opera"],
    "choicesVisibleIf": "{installed} contains {item}",
    // ...
  }, {
    "name": "secondChoice",
    "choices": ["Chrome", "MS Edge", "FireFox", "Internet Explorer", "Safari", "Opera"],
    "choicesVisibleIf": "{installed} contains {item} and {item} != {default}",
    // ...
  }]
}
```

[View Matrix Demo](https://surveyjs.io/Examples/Library?id=condition-matrixVisibleIf (linkStyle))
[View Matrix Dropdown Demo](https://surveyjs.io/Examples/Library?id=condition-matrixDropdownVisibleIf (linkStyle))

## Conditional Survey Logic (Triggers)

Triggers allow you to implement additional logic that isn't related to [read-only or required state or visibility](#conditional-visibility). Each trigger is associated with an expression and an action. A survey re-evaluates this expression each time values used in it are changed. If the expression returns `true`, the survey preforms the associated action.

The following triggers are available:

- [`complete`](#complete)
- [`setvalue`](#setvalue)
- [`copyvalue`](#copyvalue)
- [`runexpression`](#runexpression)
- [`skip`](#skip)
  
---

### `complete`

Completes the survey. The `expression` is evaluated only when a user switches to the next page.

In the following code, a trigger completes the survey if the `"age"` question on this page has a value under 18:

```js
const surveyJson = {
  "elements": [{
    "name": "age", 
    // ...
  }],
  "triggers": [
    { "type": "complete", "expression": "{age} < 18" }
  ]
}
```

[View Demo](https://surveyjs.io/form-library/examples/trigger-complete/ (linkStyle))

---

### `setvalue`

Sets a specified value to a given question. The `setValue` property specifies the value; the `setToName` property specifies the question name.

In the following code, triggers are used to set the `"ageType"` value to `"minor"` or `"adult"` based on the `"age"` question value:

```js
const surveyJson = {
  "elements": [{
    "name": "age", 
    // ...
  }, {
    "name": "ageType",
    // ...
  }],
  "triggers": [{
    "type": "setvalue",
    "expression": "{age} < 18",
    "setToName": "ageType",
    "setValue": "minor"
  }, {
    "type": "setvalue",
    "expression": "{age} >= 18",
    "setToName": "ageType",
    "setValue": "adult"
  }]
}
```

[View Demo](https://surveyjs.io/form-library/examples/trigger-setvalue/ (linkStyle))

---

### `copyvalue`

Copies a value from one question to another. The `fromName` property specifies the source question; the `setToName` property specifies the target question.

In the following code, a trigger copies the `"billingAddress"` question value into the `"shippingAddress"` question if the `"sameAsBilling"` question is `Yes`:

```js
const surveyJson = {
  "elements": [{
    "name": "billingAddress", 
    // ...
  }, {
    "name": "shippingAddress",
    // ...
  }, {
    "name": "sameAsBilling",
    "choices": [ "Yes", "No" ]
    // ...
  }],
  "triggers": [{
    "type": "copyvalue",
    "expression": "{sameAsBilling} = 'Yes'",
    "fromName": "billingAddress",
    "setToName": "shippingAddress"
  }]
}
```

[View Demo](https://surveyjs.io/form-library/examples/trigger-copyvalue/ (linkStyle))

---

### `runexpression`

If the `expression` is `true`, the trigger runs another expression specified by the `runExpression` property. You can also save the result of `runExpression` as a question value. For this, assign the question's name to the `setToName` property.

[View Demo](https://surveyjs.io/form-library/examples/trigger-runexpression/ (linkStyle))

---

### `skip`

Switches the survey to a target question's page and focuses the question. The `gotoName` property specifies the target question.

In the following code, a trigger navigates to the `"additionalInfoPage"` page and focuses the `"additionalInfo"` question if the `"sameAsBilling"` question is `Yes`:

```js
const surveyJson = {
 "pages": [{
   "name": "billingAddressPage",
   "elements": [{
     "name": "billingAddress",
     // ...
    }]
  }, {
   "name": "shippingAddressPage",
   "elements": [{
      "name": "sameAsBilling",
      "choices": [ "Yes", "No" ]
      // ...
  }, {     
     "name": "shippingAddress",
     "visibleIf": "{sameAsBilling} = 'No'",
     // ...
    }]
  }, {
   "name": "additionalInfoPage",
   "elements": [{
     "name": "additionalInfo",
     // ...
    }]
  }],
 "triggers": [{
   "type": "skip",
   "expression": "{sameAsBilling} = 'Yes'",
   "gotoName": "additionalInfo"
  }]
}
```
