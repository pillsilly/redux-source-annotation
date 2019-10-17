/**
 * Prints a warning in the console if it exists.
 *
 * @param message The warning message.
 */
//打印错误信息
export default function warning(message: string): void {
  /* eslint-disable no-console */
  //如果支持console.error则打印信息
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message)
  }
  /* eslint-enable no-console */
  //抛出错误
  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message)
  } catch (e) {} // eslint-disable-line no-empty
}
