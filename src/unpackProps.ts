export function unpackProps(props: Record<string, any> | null): {
  classes: string[],
  styles: Record<string, string>,
  attributes: Record<string, string>,
  listeners: Record<string, (event: Event) => void>,
} {
  const classes: string[] = [];
  const styles: Record<string, string> = {};
  const attributes: Record<string, string> = {};
  const listeners: Record<string, (event: Event) => void> = {};
  if (props === null) {
    return {classes, styles, attributes, listeners};
  }
  for (const [key, value] of Object.entries(props)) {
    // Class handling (basic)
    if (key === 'class' || key === 'className') {
      classes.push(...value.split(' '));
    } else if (key === 'classList') {
      classes.push(...value);
    } else if (key.startsWith('class:')) {
      const className = key.slice(6);
      if (value) {
        classes.push(className);
      }
    } else if (key === 'style') {
      Object.assign(styles, value);
    } else if (key.startsWith('style:')) {
      const styleName = key.slice(6);
      styles[styleName] = value;
    } else if (key.startsWith('on:')) {
      const eventName = key.slice(3);
      listeners[eventName] = value;
    } else if (key.startsWith('on')) {
      throw new Error(`Use new-style event listeners - on:${key.slice(2)} instead of ${key}`);
    } else {
      attributes[key] = value;
    }
  }
  return {classes, styles, attributes, listeners};
}