import { ILocalizableOwner, LocalizableString } from "survey-core";
import { Base } from "../base";
import { surveyLocalization } from "../surveyStrings";
import { property } from "../jsonobject";
import { IListModel, ListModel } from "../list";
import { IPopupOptionsBase, PopupModel } from "../popup";
import { CssClassBuilder } from "../utils/cssClassBuilder";
import { defaultActionBarCss } from "./container";

export type actionModeType = "large" | "small" | "popup";

/**
 * An action item.
 * Action items are used in the Toolbar, matrix rows, titles of pages, panels, questions, and other survey elements.

 */
export interface IAction {
  /**
   * A unique action item identifier.
   */
  id: string;
  /**
   * Specifies the action item's visibility.
   * @see enabled
   * @see active
   */
  visible?: boolean;
  /**
   * The action item's title.
   * @see showTitle
   * @see disableShrink
   */
  title?: string;
  locTitle?: LocalizableString;
  locTitleName?: string;
  /**
   * The action item's tooltip.
   */
  tooltip?: string;
  locTooltipName?: string;
  /**
   * Specifies whether users can interact with the action item.
   * @see active
   * @see visible
   */
  enabled?: boolean;
  /**
   * Specifies the visibility of the action item's title.
   * @see title
   * @see disableShrink
   */
  showTitle?: boolean;
  /**
   * A function that is executed when users click the action item.
   */
  action?: (context?: any) => void;
  /**
   * One or several CSS classes that you want to apply to the outer `<div>` element.
   * In the markup, an action item is rendered as an `<input>` wrapped in a `<div>`. The `css` property applies classes to the `<div>`.
   * To apply several classes, separate them with a space character: "myclass1 myclass2".
   * @see innerCss
   */
  css?: string;
  /**
   * One or several CSS classes that you want to apply to the inner `<input>` element.
   * In the markup, an action item is rendered as an `<input>` wrapped in a `<div>`. The `innerCss` property applies classes to the `<input>`.
   * To apply several classes, separate them with a space character: "myclass1 myclass2".
   * @see css
   */
  innerCss?: string;
  /**
   * The action item's data object. Use it to pass required data to a custom template or component.
   */
  data?: any;
  popupModel?: any; //TODO: temp, use data instead
  needSeparator?: boolean; //TODO: temp
  /**
   * Specifies whether the action item is active.
   * Use it as a flag to specify different action item appearances in different states.
   * @see enabled
   * @see visible
   */
  active?: boolean;
  pressed?: boolean;
  /**
   * Specifies the name of a template used to render the action item.
   * @see component
   */
  template?: string;
  /**
   * Specifies the name of a component used to render the action item.
   */
  component?: string;
  /**
   * The action item's icon name.
   * @see iconSize
   */
  iconName?: string;
  /**
   * The action item's icon size in pixels.
   * @see iconName
   */
  iconSize?: number;
  /**
   * The action item's location in a matrix question's row.
   *
   * The following values are available:
   *
   * - `"start"` - The action item is located at the beginning of the row.
   * - `"end"` - The action is located at the end of the row.
   */
  location?: string;
  /**
   * Set this property to `true` if you want to disable keyboard navigation for the action item (sets the `tabIndex` attribute to -1).
   */
  disableTabStop?: boolean;

  /**
   * Set this property to `true` if you want the item's `title` to be always visible.
   * If you set it to `false`, the `title` hides when the screen space is limited, and the item displays only the icon.
   * @see title
   * @see iconName
   */
  disableShrink?: boolean;
  disableHide?: boolean;
  mode?: actionModeType;
  visibleIndex?: number;
  needSpace?: boolean;
  ariaChecked?: boolean;
}

export interface IActionDropdownPopupOptions extends IListModel, IPopupOptionsBase {
}
export function createDropdownActionModel(actionOptions: IAction, dropdownOptions: IActionDropdownPopupOptions, locOwner?: ILocalizableOwner): Action {
  return createDropdownActionModelAdvanced(actionOptions, dropdownOptions, dropdownOptions, locOwner);
}
export function createDropdownActionModelAdvanced(actionOptions: IAction, listOptions: IListModel, popupOptions?: IPopupOptionsBase, locOwner?: ILocalizableOwner): Action {
  const listModel: ListModel = new ListModel(
    listOptions.items,
    (item: Action) => {
      listOptions.onSelectionChanged(item),
      innerPopupModel.toggleVisibility();
    },
    listOptions.allowSelection,
    listOptions.selectedItem,
    listOptions.onFilterStringChangedCallback
  );
  listModel.locOwner = locOwner;
  const innerPopupModel: PopupModel = new PopupModel("sv-list", { model: listModel }, popupOptions?.verticalPosition, popupOptions?.horizontalPosition, popupOptions?.showPointer, popupOptions?.isModal, popupOptions?.onCancel, popupOptions?.onApply, popupOptions?.onHide, popupOptions?.onShow, popupOptions?.cssClass, popupOptions?.title);
  innerPopupModel.displayMode = popupOptions?.displayMode as any;

  const newActionOptions = Object.assign({}, actionOptions, {
    component: "sv-action-bar-item-dropdown",
    popupModel: innerPopupModel,
    action: () => {
      !!(actionOptions.action) && actionOptions.action();
      innerPopupModel.toggleVisibility();
    },
  });
  const newAction: Action = new Action(newActionOptions);
  newAction.data = listModel;

  return newAction;
}

export class Action extends Base implements IAction, ILocalizableOwner {
  private locTitleValue: LocalizableString;
  public updateCallback: () => void;
  private raiseUpdate() {
    this.updateCallback && this.updateCallback();
  }
  constructor(public innerItem: IAction) {
    super();
    this.locTitle = !!innerItem ? innerItem["locTitle"] : null;
    //Object.assign(this, item) to support IE11
    if (!!innerItem) {
      for (var key in innerItem) {
        (<any>this)[key] = (<any>innerItem)[key];
      }
    }
    if (!!this.locTitleName) {
      this.locTitleChanged();
    }
    this.locStrChangedInPopupModel();
  }
  private createLocTitle(): LocalizableString {
    return this.createLocalizableString("title", this, true);
  }
  public owner: ILocalizableOwner;
  location?: string;
  @property() id: string;
  @property() iconName: string;
  @property() iconSize: number = 24;
  @property({
    defaultValue: true, onSet: (_, target: Action) => {
      target.raiseUpdate();
    }
  }) visible: boolean;
  @property() tooltip: string;
  @property({
    onSet: (_, target: Action) => {
      target.locTooltipChanged();
    }
  }) locTooltipName?: string;
  @property() enabled: boolean;
  @property() showTitle: boolean;
  @property() action: (context?: any) => void;
  @property() css: string;
  @property() innerCss: string;
  @property() data: any;
  @property() popupModel: any;
  @property() needSeparator: boolean;
  @property() active: boolean;
  @property() pressed: boolean;
  @property() template: string;
  @property() component: string;
  @property() items: any;
  @property() visibleIndex: number;
  @property({ defaultValue: "large" }) mode: actionModeType;
  @property() disableTabStop: boolean;
  @property() disableShrink: boolean;
  @property() disableHide: boolean;
  @property({ defaultValue: false }) needSpace: boolean;
  @property() ariaChecked: boolean;
  @property({
    onSet: (val, target) => {
      if (target.locTitleValue.text === val) return;
      target.locTitleValue.text = val;
    }
  }) title: string;
  public get locTitle(): LocalizableString { return this.locTitleValue; }
  public set locTitle(val: LocalizableString) {
    if (!val && !this.locTitleValue) {
      val = this.createLocTitle();
    }
    if (!!this.locTitleValue) {
      this.locTitleValue.onStringChanged.remove(this.locTitleChanged);
    }
    this.locTitleValue = val;
    this.locTitleValue.onStringChanged.add(this.locTitleChanged);
    this.locTitleChanged();
  }
  public get locTitleName(): string {
    return this.locTitle.localizationName;
  }
  public set locTitleName(val: string) {
    this.locTitle.localizationName = val;
  }
  public locStrsChanged(): void {
    super.locStrsChanged();
    this.locTooltipChanged();
    this.locStrChangedInPopupModel();
  }
  private locStrChangedInPopupModel(): void {
    if (!this.popupModel || !this.popupModel.contentComponentData || !this.popupModel.contentComponentData.model) return;
    const model = this.popupModel.contentComponentData.model;
    if (Array.isArray(model.actions)) {
      const actions: Array<any> = model.actions;
      actions.forEach(item => {
        if (!!(<any>item).locStrsChanged) {
          (<any>item).locStrsChanged();
        }
      });
    }
  }
  private locTitleChanged = () => {
    const val = this.locTitle.renderedHtml;
    this.setPropertyValue("title", !!val ? val : undefined);
  }
  private locTooltipChanged(): void {
    if (!this.locTooltipName) return;
    this.tooltip = surveyLocalization.getString(this.locTooltipName, this.locTitle.locale);
  }
  private cssClassesValue: any;

  public set cssClasses(val: any) {
    this.cssClassesValue = val;
  }

  public get cssClasses() {
    return this.cssClassesValue || defaultActionBarCss;
  }

  public get disabled(): boolean {
    return this.enabled !== undefined && !this.enabled;
  }

  public get hasTitle(): boolean {
    return (
      ((this.mode != "small" &&
        (this.showTitle || this.showTitle === undefined)) ||
        !this.iconName) &&
      !!this.title
    );
  }
  public get isVisible() {
    return this.visible && this.mode !== "popup";
  }

  public get canShrink() {
    return !!this.iconName;
  }

  public getActionRootCss(): string {
    return new CssClassBuilder()
      .append("sv-action")
      .append(this.css)
      .append("sv-action--space", this.needSpace)
      .append("sv-action--hidden", !this.isVisible)
      .toString();
  }
  public getActionBarItemTitleCss(): string {
    return new CssClassBuilder()
      .append(this.cssClasses.itemTitle)
      .append(this.cssClasses.itemTitleWithIcon, !!this.iconName)
      .toString();
  }
  public getActionBarItemCss(): string {
    return new CssClassBuilder()
      .append(this.cssClasses.item)
      .append(this.cssClasses.itemAsIcon, !this.hasTitle)
      .append(this.cssClasses.itemActive, !!this.active)
      .append(this.cssClasses.itemPressed, !!this.pressed)
      .append(this.innerCss)
      .toString();
  }
  //ILocalizableOwner
  getLocale(): string { return this.owner ? this.owner.getLocale() : ""; }
  getMarkdownHtml(text: string, name: string): string { return this.owner ? this.owner.getMarkdownHtml(text, name) : undefined; }
  getProcessedText(text: string): string { return this.owner ? this.owner.getProcessedText(text) : text; }
  getRenderer(name: string): string { return this.owner ? this.owner.getRenderer(name) : null; }
  getRendererContext(locStr: LocalizableString): any { return this.owner ? this.owner.getRendererContext(locStr) : locStr; }

  minDimension: number;
  maxDimension: number;
}

export class ActionDropdownViewModel {
  private popupModel: any;
  private funcKey = "sv-dropdown-action";
  constructor(private item: Action) {
    this.setupPopupCallbacks();
  }
  private setupPopupCallbacks() {
    const popupModel = this.popupModel = this.item.popupModel;
    if (!popupModel) return;
    popupModel.registerPropertyChangedHandlers(["isVisible"], () => {
      if (!popupModel.isVisible) {
        this.item.pressed = false;
      } else {
        this.item.pressed = true;
      }
    }, this.funcKey);
  }
  private removePopupCallbacks() {
    if (!!this.popupModel) {
      this.popupModel.unregisterPropertyChangedHandlers(["isVisible"], this.funcKey);
    }
  }
  public dispose(): void {
    this.removePopupCallbacks();
  }
}