import { Selector, ClientFunction } from "testcafe";
import { url, frameworks, initSurvey, url_test, checkElementScreenshot, explicitErrorHandler } from "../../helper";

const title = "Survey Screenshot";

fixture`${title}`.page`${url}`;

const applyTheme = ClientFunction(theme => {
  (<any>window).Survey.StylesManager.applyTheme(theme);
});

const theme = "defaultV2";

const json = {
  "title": "Minimum data reporting form – for suspected and probable cases of COVID-19",
  "pages": [{
    "name": "page1",
    "navigationTitle": "Sign In",
    "navigationDescription": "... to continue purchasing.",
    "elements": [
      {
        "name": "q1",
        type: "text"
      }
    ]
  }, {
    "name": "page2",
    "navigationTitle": "Shipping",
    "title": "Shipping",
    "navigationDescription": "Enter shipping information.",
    "elements": [
      {
        "type": "radiogroup",
        "name": "q1",
        "title": "Select a shipping method.",
        "choices": ["FedEx", "DHL", "USP", "In-Store Pickup"]
      },
    ]
  }, {
    "name": "page3",
    "navigationTitle": "Payment",
    "navigationDescription": "Select a payment method.",
    "elements": [
      {
        "name": "q1",
        type: "text"
      }
    ]
  }, {
    "name": "page4",
    "navigationTitle": "Gift Options",
    "navigationDescription": "Choose your gift.",
    "elements": [
      {
        "name": "q1",
        type: "text"
      }
    ]
  }, {
    "name": "page5",
    "navigationTitle": "Place Order",
    "navigationDescription": "Finish your purchasing.",
    "elements": [{
      "name": "q1",
      type: "text"
    }]
  }],
  "showProgressBar": "top",
  "progressBarType": "buttons"
};

frameworks.forEach(framework => {
  fixture`${framework} ${title} ${theme}`
    .page`${url_test}${theme}/${framework}.html`
    .beforeEach(async t => {
      await explicitErrorHandler();
      await applyTheme(theme);
    });

  test("Check survey title", async (t) => {
    await t.resizeWindow(800, 600);
    await initSurvey(framework, {
      title: "Survey Title",
      widthMode: "responsive",
      questions: [
        {
          type: "text",
          title: "Question title",
          name: "q1"
        }
      ]
    });
    await checkElementScreenshot("survey-title.png", Selector(".sd-title"), t);
    await ClientFunction(() => {
      (<any>window).survey.description = "descr";
    })();
    await checkElementScreenshot("survey-title-descr.png", Selector(".sd-title"), t);
    await checkElementScreenshot("survey-body.png", Selector(".sd-body"), t);
  });
  test("Check survey with progress top", async (t) => {
    await t.resizeWindow(1920, 1080);
    await initSurvey(framework, json);
    await ClientFunction(() => {
      (<any>window).survey.progressBarType = "pages";
      (<any>window).survey.currentPageNo = 1;
    })();
    await checkElementScreenshot("survey-progress-bar-top.png", Selector(".sd-container-modern"), t); // title + progress
  });
  test("Check survey with progress top buttons", async (t) => {
    await t.resizeWindow(1920, 1080);
    await initSurvey(framework, json);
    await t.click(Selector("li").nth(1));
    await checkElementScreenshot("survey-progress-bar-top-buttons.png", Selector(".sd-container-modern"), t);
  });
  test("Check survey with custom navigation", async (t) => {
    await t.resizeWindow(1920, 1080);
    await initSurvey(framework, json);
    await ClientFunction(() => {
      (<any>window).survey.progressBarType = "pages";
      (<any>window).survey.currentPageNo = 1;
      (<any>window).survey.addNavigationItem({
        title: "Save",
        action: () => { }
      });
    })();
    await checkElementScreenshot("survey-custom-navigation.png", Selector(".sd-container-modern"), t);
  });

  const testedPages = [{
    name: "page1",
    title: "Test",
    elements: [
      {
        name: "q1",
        type: "text"
      }
    ]
  }];

  test("Check survey without title and with progress", async (t) => {
    await t.resizeWindow(1920, 1080);
    await initSurvey(framework, {
      pages: testedPages,
      showProgressBar: "top"
    });
    await checkElementScreenshot("survey-without-tilte-and-with-progress.png", Selector(".sd-container-modern"), t); // progress
  });
  test("Check survey without title and progress", async (t) => {
    await t.resizeWindow(1920, 1080);
    await initSurvey(framework, {
      pages: testedPages
    });
    await checkElementScreenshot("survey-without-tilte-and-progress.png", Selector(".sd-container-modern"), t); // without title and progress
  });
  test("Check survey with title and without progress", async (t) => {
    await t.resizeWindow(1920, 1080);
    await initSurvey(framework, {
      title: "Test",
      pages: testedPages
    });
    await checkElementScreenshot("survey-with-tilte-and-without-progress.png", Selector(".sd-container-modern"), t); // title
  });
  test("Check survey with width", async (t) => {
    await t.resizeWindow(1920, 1080);
    await initSurvey(framework, {
      title: "Test",
      widthMode: "static",
      width: "900px",
      pages: testedPages
    });
    await checkElementScreenshot("survey-with-width.png", Selector(".sd-container-modern"), t); // title
  });
  test("Check survey with width adaptivity", async (t) => {
    await t.resizeWindow(700, 1080);
    await initSurvey(framework, {
      title: "Test",
      widthMode: "static",
      width: "900px",
      pages: testedPages
    });
    await checkElementScreenshot("survey-with-width-adaptivity.png", Selector(".sd-container-modern"), t); // title
  });
  test("Check survey title with logo", async (t) => {
    await t.resizeWindow(1920, 1080);
    await initSurvey(framework, {
      "logo": "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyNi4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHZpZXdCb3g9IjAgMCAyMDAgMTAyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAyMDAgMTAyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7ZmlsbDojMTlCMzk0O30NCgkuc3Qxe2ZpbGw6I0ZGOTgxNDt9DQo8L3N0eWxlPg0KPGc+DQoJPHBhdGggY2xhc3M9InN0MCIgZD0iTTE5NS45LDIwSDQuMUgwdjQuMXY1NHY0LjFoNC4xaDE3My40bDE1LjcsMTMuOGw2LjgsNnYtOVYyNC4xVjIwSDE5NS45eiBNMTk1LjksOTIuOUwxNzksNzguMUg0LjF2LTU0aDE5MS44DQoJCVY5Mi45eiBNMTI2LjEsNjEuN2wtNi44LTE3LjJoNC41bDQuNywxMy40bDQuMS0xMy40aDQuMWwtNy4yLDIwLjZjLTAuNCwxLjItMS4xLDIuMi0yLjEsM2MtMSwwLjgtMi4zLDEuMS0zLjcsMS4xDQoJCWMtMC40LDAtMC43LDAtMS4xLTAuMWMtMC40LTAuMS0wLjctMC4xLTEuMS0wLjNWNjVjMC40LDAuMSwwLjcsMC4yLDEuMSwwLjJjMC4zLDAuMSwwLjYsMC4xLDAuOSwwLjFjMC4zLDAsMC41LTAuMSwwLjgtMC4yDQoJCWMwLjItMC4xLDAuNS0wLjMsMC43LTAuNmMwLjItMC4zLDAuNC0wLjcsMC42LTEuMUMxMjUuNyw2MywxMjUuOSw2Mi40LDEyNi4xLDYxLjd6IE0xMDMuMyw1OS40YzAuOCwwLjgsMS43LDEuNCwyLjksMS45DQoJCXMyLjQsMC43LDMuNywwLjdjMS45LDAsMy42LTAuNCw1LTEuM2MxLjQtMC44LDIuNC0xLjksMy0zLjJsLTMuOC0xYy0wLjMsMC43LTAuOCwxLjMtMS42LDEuN2MtMC44LDAuNC0xLjYsMC42LTIuNSwwLjYNCgkJYy0wLjYsMC0xLjEtMC4xLTEuNi0wLjNjLTAuNS0wLjItMS0wLjUtMS40LTAuOWMtMC40LTAuNC0wLjgtMC44LTEtMS4zYy0wLjMtMC41LTAuNC0xLjEtMC41LTEuOGgxMy4zYzAtMC4yLDAuMS0wLjQsMC4xLTAuNw0KCQljMC0wLjMsMC0wLjUsMC0wLjhjMC0xLjItMC4yLTIuMy0wLjYtMy4zYy0wLjQtMS4xLTEtMi0xLjgtMi44Yy0wLjgtMC44LTEuNy0xLjUtMi44LTEuOWMtMS4xLTAuNS0yLjQtMC43LTMuOC0wLjcNCgkJcy0yLjcsMC4yLTMuOCwwLjdjLTEuMSwwLjUtMi4xLDEuMS0yLjksMmMtMC44LDAuOC0xLjQsMS44LTEuOCwyLjljLTAuNCwxLjEtMC42LDIuMi0wLjYsMy41YzAsMS4yLDAuMiwyLjMsMC42LDMuNA0KCQlDMTAxLjksNTcuNiwxMDIuNSw1OC41LDEwMy4zLDU5LjR6IE0xMDUuOSw0OS45YzAuMy0wLjUsMC42LTEsMS0xLjNjMC40LTAuNCwwLjgtMC43LDEuNC0wLjljMC41LTAuMiwxLjEtMC4zLDEuNy0wLjMNCgkJYzEuMiwwLDIuMiwwLjQsMy4xLDEuMnMxLjMsMS44LDEuNCwzLjFoLTguOUMxMDUuNSw1MSwxMDUuNiw1MC40LDEwNS45LDQ5Ljl6IE00My43LDU1LjVjMC0wLjUtMC4xLTAuOS0wLjQtMS4zDQoJCWMtMC4zLTAuMy0wLjctMC43LTEuMi0wLjljLTAuNS0wLjMtMS4yLTAuNS0xLjktMC43Yy0wLjctMC4yLTEuNi0wLjUtMi41LTAuN2MtMS4xLTAuMy0yLjEtMC42LTIuOS0xYy0wLjgtMC40LTEuNS0wLjgtMi4xLTEuMw0KCQljLTAuNS0wLjUtMS0xLjEtMS4yLTEuN2MtMC4zLTAuNi0wLjQtMS40LTAuNC0yLjNjMC0xLjIsMC4yLTIuMiwwLjctMy4xYzAuNC0wLjksMS0xLjcsMS44LTIuM2MwLjgtMC42LDEuNy0xLjEsMi43LTEuNA0KCQljMS0wLjMsMi4xLTAuNSwzLjMtMC41YzEuNiwwLDMuMSwwLjMsNC41LDAuOGMxLjQsMC41LDIuNiwxLjEsMy42LDEuOGwtMiwzLjdjLTAuMi0wLjItMC40LTAuNC0wLjgtMC42Yy0wLjQtMC4zLTAuOS0wLjUtMS41LTAuOA0KCQljLTAuNi0wLjMtMS4yLTAuNS0xLjktMC42Yy0wLjctMC4yLTEuNC0wLjMtMi4xLTAuM2MtMS4yLDAtMi4yLDAuMi0yLjgsMC43Yy0wLjYsMC41LTAuOSwxLjEtMC45LDEuOWMwLDAuNSwwLjEsMC45LDAuMywxLjINCgkJYzAuMiwwLjMsMC42LDAuNiwxLDAuOGMwLjQsMC4yLDEsMC41LDEuNywwLjdjMC43LDAuMiwxLjQsMC40LDIuMywwLjZjMS4xLDAuMywyLjIsMC42LDMuMSwxYzAuOSwwLjMsMS43LDAuOCwyLjQsMS4zDQoJCWMwLjYsMC41LDEuMSwxLjIsMS41LDEuOWMwLjMsMC43LDAuNSwxLjYsMC41LDIuN2MwLDEuMi0wLjIsMi4zLTAuNywzLjJjLTAuNSwwLjktMS4xLDEuNi0xLjksMi4xYy0wLjgsMC41LTEuNywwLjktMi44LDEuMg0KCQljLTEsMC4zLTIuMSwwLjQtMy4zLDAuNGMtMS43LDAtMy41LTAuMy01LjItMC44Yy0xLjctMC41LTMuMi0xLjMtNC42LTIuMmwyLTMuOWMwLjIsMC4yLDAuNiwwLjUsMS4xLDAuOGMwLjUsMC4zLDEuMSwwLjYsMS44LDENCgkJYzAuNywwLjMsMS41LDAuNiwyLjMsMC44YzAuOSwwLjIsMS43LDAuMywyLjYsMC4zQzQyLjUsNTcuOCw0My43LDU3LjEsNDMuNyw1NS41eiBNNTIuNyw2MC4zYy0wLjktMS4xLTEuNC0yLjgtMS40LTUuMVY0NC41aDQuNA0KCQl2OS44YzAsMi42LDEsNCwyLjksNGMwLjksMCwxLjctMC4zLDIuNS0wLjhjMC44LTAuNSwxLjQtMS4zLDItMi4zVjQ0LjVoNC40djEyLjFjMCwwLjUsMC4xLDAuOCwwLjIsMWMwLjIsMC4yLDAuNCwwLjMsMC44LDAuM3YzLjcNCgkJYy0wLjQsMC4xLTAuOCwwLjEtMS4xLDAuMmMtMC4zLDAtMC42LDAtMC44LDBjLTAuOCwwLTEuNC0wLjItMS45LTAuNWMtMC41LTAuNC0wLjgtMC45LTAuOS0xLjVsLTAuMS0xLjRjLTAuOCwxLjItMS43LDIuMS0zLDIuNw0KCQljLTEuMiwwLjYtMi41LDAuOS00LDAuOUM1NSw2Miw1My43LDYxLjQsNTIuNyw2MC4zeiBNNzYuMiw2MS43aC00LjRWNDQuNWg0djMuN2MwLjMtMC42LDAuNy0xLjEsMS4xLTEuNmMwLjQtMC41LDAuOS0wLjksMS4zLTEuMg0KCQljMC41LTAuMywxLTAuNiwxLjUtMC44YzAuNS0wLjIsMS0wLjMsMS40LTAuM2MwLjIsMCwwLjQsMCwwLjUsMHMwLjIsMCwwLjMsMHY0Yy0xLjMsMC0yLjUsMC4zLTMuNiwwLjhjLTEuMSwwLjUtMS44LDEuMi0yLjMsMi4yDQoJCVY2MS43eiBNODkuMSw2MS43bC02LjMtMTcuMmg0LjVsNC40LDEzLjZsNC40LTEzLjZoNC4xbC02LjMsMTcuMkg4OS4xeiIvPg0KCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMzUuOSw1Ni45YzAuMywwLjIsMC44LDAuNSwxLjUsMC43YzAuNywwLjMsMS42LDAuNCwyLjUsMC40YzAuOSwwLDEuNy0wLjIsMi4yLTAuNWMwLjUtMC4zLDEtMC44LDEuMi0xLjUNCgkJYzAuMy0wLjcsMC41LTEuNSwwLjYtMi40YzAuMS0xLDAuMS0yLjEsMC4xLTMuNFYzOC40aDQuNXYxMS44YzAsMS44LTAuMSwzLjQtMC4zLDQuOGMtMC4yLDEuNS0wLjYsMi43LTEuMiwzLjcNCgkJYy0wLjYsMS0xLjUsMS44LTIuNiwyLjRjLTEuMSwwLjYtMi43LDAuOS00LjYsMC45Yy0yLDAtMy43LTAuNS01LjEtMS40TDEzNS45LDU2Ljl6IE0xNjcsNDQuNWMtMC4yLTAuMi0wLjQtMC40LTAuOC0wLjYNCgkJcy0wLjktMC41LTEuNS0wLjhjLTAuNi0wLjMtMS4yLTAuNS0xLjktMC42Yy0wLjctMC4yLTEuNC0wLjMtMi4xLTAuM2MtMS4yLDAtMi4yLDAuMi0yLjgsMC43Yy0wLjYsMC41LTAuOSwxLjEtMC45LDEuOQ0KCQljMCwwLjUsMC4xLDAuOSwwLjMsMS4yYzAuMiwwLjMsMC42LDAuNiwxLDAuOGMwLjQsMC4yLDEsMC41LDEuNywwLjdjMC43LDAuMiwxLjQsMC40LDIuMywwLjZjMS4xLDAuMywyLjIsMC42LDMuMSwxDQoJCWMwLjksMC4zLDEuNywwLjgsMi40LDEuM2MwLjYsMC41LDEuMSwxLjIsMS41LDEuOWMwLjQsMC43LDAuNSwxLjYsMC41LDIuN2MwLDEuMi0wLjIsMi4zLTAuNywzLjJjLTAuNSwwLjktMS4xLDEuNi0xLjksMi4xDQoJCWMtMC44LDAuNS0xLjcsMC45LTIuOCwxLjJjLTEsMC4zLTIuMSwwLjQtMy4zLDAuNGMtMS43LDAtMy41LTAuMy01LjItMC44Yy0xLjctMC41LTMuMi0xLjMtNC42LTIuMmwyLTMuOWMwLjIsMC4yLDAuNiwwLjUsMS4xLDAuOA0KCQljMC41LDAuMywxLjEsMC42LDEuOCwxYzAuNywwLjMsMS41LDAuNiwyLjMsMC44YzAuOSwwLjIsMS43LDAuMywyLjYsMC4zYzIuNSwwLDMuNy0wLjgsMy43LTIuNGMwLTAuNS0wLjEtMC45LTAuNC0xLjMNCgkJcy0wLjctMC43LTEuMi0wLjljLTAuNS0wLjMtMS4yLTAuNS0xLjktMC43Yy0wLjctMC4yLTEuNi0wLjUtMi41LTAuN2MtMS4xLTAuMy0yLjEtMC42LTIuOS0xYy0wLjgtMC40LTEuNS0wLjgtMi4xLTEuMw0KCQljLTAuNS0wLjUtMS0xLjEtMS4yLTEuN2MtMC4zLTAuNi0wLjQtMS40LTAuNC0yLjNjMC0xLjIsMC4yLTIuMiwwLjctMy4xYzAuNC0wLjksMS0xLjcsMS44LTIuM2MwLjgtMC42LDEuNy0xLjEsMi43LTEuNA0KCQljMS0wLjMsMi4xLTAuNSwzLjMtMC41YzEuNiwwLDMuMSwwLjMsNC41LDAuOGMxLjQsMC41LDIuNiwxLjEsMy42LDEuOEwxNjcsNDQuNXoiLz4NCjwvZz4NCjwvc3ZnPg0K",
      "logoPosition": "right",
      "title": "Test",
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "text",
              "name": "question1"
            }
          ]
        }
      ]
    });
    await checkElementScreenshot("survey-title-with-logo.png", Selector(".sd-title"), t); // without title and progress
  });

  test("Check survey navigation bar", async (t) => {
    await t.resizeWindow(400, 1080);
    const json = {
      title: "Software developer survey.",
      pages: [
        {
          "title": "What operating system do you use?",
          "elements": [
            {
              "type": "checkbox",
              "name": "opSystem",
              "title": "OS",
              "hasOther": true,
              "isRequired": true,
              "choices": ["Windows", "Linux", "Macintosh OSX"]
            }
          ]
        }, {
          "title": "What language(s) are you currently using?",
          "elements": [
            {
              "type": "checkbox",
              "name": "langs",
              "title": "Please select from the list",
              "isRequired": true,
              "choices": [
                "Javascript",
                "Java",
                "Python",
                "CSS",
                "PHP",
                "Ruby",
                "C++",
                "C",
                "Shell",
                "C#",
              ]
            }
          ]
        }, {
          "title": "Please enter your name and e-mail",
          "elements": [
            {
              "type": "text",
              "name": "name",
              "title": "Name:"
            }, {
              "type": "text",
              "name": "email",
              "title": "Your e-mail"
            }
          ]
        }
      ]
    };
    await initSurvey(framework, json);
    await ClientFunction(() => {
      window["survey"].addNavigationItem({
        id: "survey_clear_current_page", title: "Clear page", visibleIndex: 49, // "Complete" button has the visibleIndex 50.
        action: () => { window["survey"].currentPage.questions.forEach(function (question) { question.value = undefined; }); }
      });
    })();
    await t
      .click(Selector(".sd-item__control-label").withText("Windows"))
      .click(Selector(".sd-btn.sd-navigation__next-btn"))
      .click(Selector(".sd-item__control-label").withText("Javascript"));

    await checkElementScreenshot("survey-navigation-bar.png", Selector(".sd-action-bar.sd-footer.sd-body__navigation"), t);
    await t.resizeWindow(1920, 1080);
  });
  test("Check survey responsive timer", async (t) => {
    await t.resizeWindow(1920, 1080);
    const json = {
      "title": "American History",
      "showTimerPanel": "bottom",
      "showTimerPanelMode": "survey",
      "maxTimeToFinish": 60,
      "widthMode": "responsive",
      "firstPageIsStarted": true,
      "pages": [
        {
          "elements": [
            {
              "type": "html",
              "html": "You are about to start a quiz on American history. <br>You will have 10 seconds for every question and 25 seconds to end the quiz.<br>Enter your name below and click <b>Start Quiz</b> to begin."
            }
          ]
        },
        {
          "elements": [
            {
              "type": "radiogroup",
              "name": "civilwar",
              "title": "When was the American Civil War?",
              "choices": [
                "1796-1803",
                "1810-1814",
                "1861-1865",
                "1939-1945"
              ],
              "correctAnswer": "1861-1865"
            },
            {
              "type": "radiogroup",
              "name": "libertyordeath",
              "title": "Whose quote is this: \"Give me liberty, or give me death\"?",
              "choices": [
                "John Hancock",
                "James Madison",
                "Patrick Henry",
                "Samuel Adams"
              ],
              "correctAnswer": "Patrick Henry"
            },
            {
              "type": "radiogroup",
              "name": "magnacarta",
              "title": "What is Magna Carta?",
              "choices": [
                "The foundation of the British parliamentary system",
                "The Great Seal of the monarchs of England",
                "The French Declaration of the Rights of Man",
                "The charter signed by the Pilgrims on the Mayflower"
              ],
              "correctAnswer": "The foundation of the British parliamentary system"
            }
          ]
        }
      ]
    };
    await ClientFunction(() => {
      const style = document.createElement("style");
      style.innerHTML = ".sd-timer__progress--animation { transition: none !important; }";
      document.body.appendChild(style);
      (<any>window).Survey.SurveyTimer.instance.start = () => {};
    })();
    await initSurvey(framework, json);
    await t.click(Selector(".sd-navigation__start-btn"));
    await checkElementScreenshot("survey-responsive-timer.png", Selector("body"), t);
  });
  test("Check survey timer", async (t) => {
    await t.resizeWindow(1920, 1080);
    const json = {
      "title": "American History",
      "showTimerPanel": "bottom",
      "showTimerPanelMode": "survey",
      "maxTimeToFinish": 60,
      "widthMode": "static",
      "firstPageIsStarted": true,
      "pages": [
        {
          "elements": [
            {
              "type": "html",
              "html": "You are about to start a quiz on American history. <br>You will have 10 seconds for every question and 25 seconds to end the quiz.<br>Enter your name below and click <b>Start Quiz</b> to begin."
            }
          ]
        },
        {
          "elements": [
            {
              "type": "radiogroup",
              "name": "civilwar",
              "title": "When was the American Civil War?",
              "choices": [
                "1796-1803",
                "1810-1814",
                "1861-1865",
                "1939-1945"
              ],
              "correctAnswer": "1861-1865"
            },
            {
              "type": "radiogroup",
              "name": "libertyordeath",
              "title": "Whose quote is this: \"Give me liberty, or give me death\"?",
              "choices": [
                "John Hancock",
                "James Madison",
                "Patrick Henry",
                "Samuel Adams"
              ],
              "correctAnswer": "Patrick Henry"
            },
            {
              "type": "radiogroup",
              "name": "magnacarta",
              "title": "What is Magna Carta?",
              "choices": [
                "The foundation of the British parliamentary system",
                "The Great Seal of the monarchs of England",
                "The French Declaration of the Rights of Man",
                "The charter signed by the Pilgrims on the Mayflower"
              ],
              "correctAnswer": "The foundation of the British parliamentary system"
            }
          ]
        }
      ]
    };
    await ClientFunction(() => {
      const style = document.createElement("style");
      style.innerHTML = ".sd-timer__progress--animation { transition: none !important; }";
      document.body.appendChild(style);
      (<any>window).Survey.SurveyTimer.instance.start = () => {};
    })();
    await initSurvey(framework, json);
    await t.click(Selector(".sd-navigation__start-btn"));
    await checkElementScreenshot("survey-timer.png", Selector("body"), t);
  });
});
