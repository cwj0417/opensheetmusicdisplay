import Vex from "vexflow";
import VF = Vex.Flow;
import {FontStyles} from "../../../Common/Enums/FontStyles";
import {Fonts} from "../../../Common/Enums/Fonts";
import {RectangleF2D} from "../../../Common/DataObjects/RectangleF2D";
import {PointF2D} from "../../../Common/DataObjects/PointF2D";
import {BackendType} from "../../../OpenSheetMusicDisplay/OSMDOptions";
import {GraphicalMusicPage} from "../GraphicalMusicPage";
import {EngravingRules} from "../EngravingRules";

export class VexFlowBackends {
  public static CANVAS: 0;
  public static RAPHAEL: 1; // this is currently unused in OSMD, and outdated in Vexflow.
  // maybe SVG should be 1? but this could be a breaking change if people use numbers (2) instead of names (.SVG).
  public static SVG: 2;
  public static VML: 3; // this is currently unused in OSMD, and outdated in Vexflow

}

export abstract class VexFlowBackend {

  /** The GraphicalMusicPage the backend is drawing from. Each backend only renders one GraphicalMusicPage, to which the coordinates are relative. */
  public graphicalMusicPage: GraphicalMusicPage;
  protected rules: EngravingRules;
  public width: number; // read-only
  public height: number; // read-only

  public abstract initialize(container: HTMLElement, zoom: number): void;

  public getInnerElement(): HTMLElement {
    return this.inner;
  }

  public getCanvas(): HTMLElement {
    return this.canvas;
  }

  public abstract getCanvasSize(): number;

  public getRenderElement(): HTMLElement {
    //console.log("backend type: " + this.getVexflowBackendType());
    let renderingHtmlElement: HTMLElement = this.canvas; // for SVGBackend
    if (this.getVexflowBackendType() === VF.Renderer.Backends.CANVAS) {
      renderingHtmlElement = this.inner;
      // usage in removeFromContainer:
      // for SVG, this.canvas === this.inner, but for Canvas, removing this.canvas causes an error because it's not a child of container,
      // so we have to remove this.inner instead.
    }
    return renderingHtmlElement;
  }

  public getRenderer(): VF.Renderer {
    return this.renderer;
  }

  public removeAllChildrenFromContainer(container: HTMLElement): void {
    while (container.children.length !== 0) {
      container.removeChild(container.children.item(0));
    }
  }

  // note: removing single children to remove all is error-prone, because sometimes a random SVG-child remains.
  public removeFromContainer(container: HTMLElement): void {
    const htmlElementToRemove: HTMLElement = this.getRenderElement();

    // only remove child if the container has this child, otherwise it will throw an error.
    for (let i: number = 0; i < container.children.length; i++) {
      if (container.children.item(i) === htmlElementToRemove) {
        container.removeChild(htmlElementToRemove);
        break;
      }
    }
    // there is unfortunately no built-in container.hasChild(child) method.
  }

public abstract getContext(): Vex.IRenderContext;

  // public abstract setWidth(width: number): void;
  // public abstract setHeight(height: number): void;

  public abstract scale(k: number): void;

  public resize(width: number, height: number): void {
    this.renderer.resize(width, height);
    this.width = width;
    this.height = height;
  }

  public abstract clear(): void;

  public abstract translate(x: number, y: number): void;
  public abstract renderText(fontHeight: number, fontStyle: FontStyles, font: Fonts, text: string,
                             heightInPixel: number, screenPosition: PointF2D,
                             color?: string, fontFamily?: string): Node;
  /**
   * Renders a rectangle with the given style to the screen.
   * It is given in screen coordinates.
   * @param rectangle the rect in screen coordinates
   * @param layer is the current rendering layer. There are many layers on top of each other to which can be rendered. Not needed for now.
   * @param styleId the style id
   * @param alpha alpha value between 0 and 1
   */
  public abstract renderRectangle(rectangle: RectangleF2D, styleId: number, colorHex: string, alpha: number): Node;

  public abstract renderLine(start: PointF2D, stop: PointF2D, color: string, lineWidth: number, id?: string): Node;

  public abstract renderCurve(points: PointF2D[]): Node;

  public abstract renderPath(points: PointF2D[], fill: boolean, id?: string): Node;

  public abstract getVexflowBackendType(): VF.Renderer.Backends;

  /** The general type of backend: Canvas or SVG.
   * This is not used for now (only VexflowBackendType used), but it may be useful when we don't want to use a Vexflow class.
   */
  public abstract getOSMDBackendType(): BackendType;

  protected renderer: VF.Renderer;
  protected inner: HTMLElement;
  protected canvas: HTMLElement;
}
