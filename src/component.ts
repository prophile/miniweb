export const Fragment: unique symbol = Symbol("Fragment");
export const Text: unique symbol = Symbol("Text");

export type Ref = (element: any) => void;
export type FunctionalComponent = (props: Record<string, any>, ref: Ref) => MiniNode;
export type MiniNode = MiniElement | string | number | null | undefined | MiniNode[];
export type Component = string | typeof Fragment | typeof Text | FunctionalComponent;

export type MiniElement =
  | {
      type: string | FunctionalComponent;
      props: Record<string, any>;
      key: string | number | null;
      ref: Ref | null;
      children: MiniElement[];
    }
  | {
      type: typeof Text;
      props: { text: string };
      key: null;
      ref: null;
      children: [];
    };
