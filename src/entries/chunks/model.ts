// styles
// import "../../main.scss";
//import "../../modern.scss";

export var Version: string;
Version = `${process.env.VERSION}`;

export function checkLibraryVersion(ver: string, libraryName: string): void {
  if(Version != ver) {
    const str = "survey-core has version '" + Version + "' and " + libraryName
      + " has version '" + ver + "'. SurveyJS libraries should have the same versions to work correctly.";
    /* eslint no-console: ["error", { allow: ["error"] }] */
    console.error(str);
  }
}

export { settings } from "../../settings";
export { Helpers, HashTable } from "../../helpers";
export {
  AnswerCountValidator,
  EmailValidator,
  NumericValidator,
  RegexValidator,
  SurveyValidator,
  TextValidator,
  ValidatorResult,
  ExpressionValidator,
  ValidatorRunner
} from "../../validator";
export { ItemValue } from "../../itemvalue";
export { Base, Event, ArrayChanges, ComputedUpdater } from "../../base";
export {
  ISurvey,
  ISurveyElement,
  IElement,
  IPage,
  ITitleOwner
} from "../../base-interfaces";
export { SurveyError } from "../../survey-error";
export { SurveyElementCore, SurveyElement, DragTypeOverMeEnum } from "../../survey-element";
export { CalculatedValue } from "../../calculatedValue";
export {
  CustomError,
  AnswerRequiredError,
  OneAnswerRequiredError,
  RequreNumericError,
  ExceedSizeError
} from "../../error";
export {
  ILocalizableOwner,
  ILocalizableString,
  LocalizableString,
  LocalizableStrings
} from "../../localizablestring";
export { HtmlConditionItem, UrlConditionItem } from "../../expressionItems";
export { ChoicesRestful, ChoicesRestfull } from "../../choicesRestful";
export { FunctionFactory, registerFunction } from "../../functionsfactory";
export { ConditionRunner, ExpressionRunner, IExpresionExecutor, ExpressionExecutor } from "../../conditions";
export {
  Operand,
  Const,
  BinaryOperand,
  Variable,
  FunctionOperand,
  ArrayOperand
} from "../../expressions/expressions";
export { ConditionsParser } from "../../conditionsParser";
export { ProcessValue } from "../../conditionProcessValue";
export {
  JsonError,
  JsonIncorrectTypeError,
  JsonMetadata,
  JsonMetadataClass,
  JsonMissingTypeError,
  JsonMissingTypeErrorBase,
  JsonObject,
  JsonObjectProperty,
  JsonRequiredPropertyError,
  JsonUnknownPropertyError,
  Serializer,
  property,
  propertyArray
} from "../../jsonobject";
export {
  MatrixDropdownCell,
  MatrixDropdownRowModelBase,
  QuestionMatrixDropdownModelBase
} from "../../question_matrixdropdownbase";
export { MatrixDropdownColumn, matrixDropdownColumnTypes } from "../../question_matrixdropdowncolumn";
export { QuestionMatrixDropdownRenderedCell, QuestionMatrixDropdownRenderedRow, QuestionMatrixDropdownRenderedTable } from "../../question_matrixdropdownrendered";
export {
  MatrixDropdownRowModel,
  QuestionMatrixDropdownModel
} from "../../question_matrixdropdown";
export {
  MatrixDynamicRowModel,
  QuestionMatrixDynamicModel
} from "../../question_matrixdynamic";
export {
  MatrixRowModel,
  MatrixCells,
  QuestionMatrixModel,
  IMatrixData
} from "../../question_matrix";
export {
  MultipleTextItemModel,
  QuestionMultipleTextModel
} from "../../question_multipletext";
export { PanelModel, PanelModelBase, QuestionRowModel } from "../../panel";
export { FlowPanelModel } from "../../flowpanel";
export { PageModel } from "../../page";
export * from "../../template-renderer";
export { DefaultTitleModel } from "../../defaultTitle";
export { Question } from "../../question";
export { QuestionNonValue } from "../../questionnonvalue";
export { QuestionEmptyModel } from "../../question_empty";
export {
  QuestionCheckboxBase,
  QuestionSelectBase
} from "../../question_baseselect";
export { QuestionCheckboxModel } from "../../question_checkbox";
export { QuestionTagboxModel } from "../../question_tagbox";
export { QuestionRankingModel } from "../../question_ranking";
export { QuestionCommentModel } from "../../question_comment";
export { QuestionDropdownModel } from "../../question_dropdown";
export { QuestionFactory, ElementFactory } from "../../questionfactory";
export { QuestionFileModel } from "../../question_file";
export { QuestionHtmlModel } from "../../question_html";
export { QuestionRadiogroupModel } from "../../question_radiogroup";
export { QuestionRatingModel, RenderedRatingItem } from "../../question_rating";
export { QuestionExpressionModel } from "../../question_expression";
export { QuestionTextModel } from "../../question_text";
export { QuestionBooleanModel } from "../../question_boolean";
export {
  QuestionImagePickerModel,
  ImageItemValue
} from "../../question_imagepicker";
export { QuestionImageModel } from "../../question_image";
export { QuestionSignaturePadModel } from "../../question_signaturepad";
export {
  QuestionPanelDynamicModel,
  QuestionPanelDynamicItem
} from "../../question_paneldynamic";
export { SurveyTimer } from "../../surveytimer";
export { SurveyTimerModel } from "../../surveyTimerModel";
export { SurveyProgressModel } from "../../surveyProgress";
export { SurveyProgressButtonsModel } from "../../surveyProgressButtons";
export { SurveyModel } from "../../survey";
export {
  SurveyTrigger,
  SurveyTriggerComplete,
  SurveyTriggerSetValue,
  SurveyTriggerVisible,
  SurveyTriggerCopyValue,
  SurveyTriggerRunExpression,
  Trigger
} from "../../trigger";
export { PopupSurveyModel, SurveyWindowModel } from "../../popup-survey";
export { TextPreProcessor } from "../../textPreProcessor";

export { dxSurveyService } from "../../dxSurveyService";
export { englishStrings } from "../../localization/english";
export { surveyLocalization, surveyStrings } from "../../surveyStrings";
// export { cultureInfo } from "../../cultureInfo";
export {
  QuestionCustomWidget,
  CustomWidgetCollection,
} from "../../questionCustomWidgets";
export {
  QuestionCustomModel,
  QuestionCompositeModel,
  ComponentQuestionJSON,
  ComponentCollection,
  ICustomQuestionTypeConfiguration
} from "../../question_custom";

export { StylesManager } from "../../stylesmanager";
export { ListModel } from "../../list";
export { MultiSelectListModel } from "../../multiSelectListModel";
export { PopupModel, createDialogOptions, IDialogOptions } from "../../popup";
export { PopupBaseViewModel } from "../../popup-view-model";
export { PopupDropdownViewModel } from "../../popup-dropdown-view-model";
export { PopupModalViewModel } from "../../popup-modal-view-model";
export { createPopupViewModel, createPopupModalViewModel } from "../../popup-utils";
export { DropdownListModel } from "../../dropdownListModel";
export { DropdownMultiSelectListModel } from "../../dropdownMultiSelectListModel";
export {
  QuestionButtonGroupModel,
  ButtonGroupItemModel,
  ButtonGroupItemValue
} from "../../question_buttongroup";
export { IsMobile, IsTouch } from "../../utils/devices";
export {
  confirmAction,
  detectIEOrEdge,
  doKey2ClickUp,
  doKey2ClickDown,
  doKey2ClickBlur,
  loadFileFromBase64,
  increaseHeightByContent,
  createSvg,
  sanitizeEditableContent,
  IAttachKey2clickOptions
} from "../../utils/utils";
export * from "../../utils/cssClassBuilder";

export { surveyCss } from "../../defaultCss/cssstandard";
//Uncomment to include the "date" question type.
//export {default as QuestionDateModel} from "../../plugins/question_date";

export { DragDropSurveyElements } from "../../dragdrop/survey-elements";
export { DragDropChoices } from "../../dragdrop/choices";
