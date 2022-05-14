export type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;

export interface SubcomponentProps {
  children: JSX.Element;
}
