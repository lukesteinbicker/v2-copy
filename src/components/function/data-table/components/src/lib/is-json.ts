export function isJSON(value: string): boolean {
  try {
    JSON.parse(value);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
