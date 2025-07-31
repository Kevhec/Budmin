function strReplaceAt(string: string, index: number, replacement: string) {
  return string.substring(0, index) + replacement + string.substring(index + replacement.length);
}

export default strReplaceAt;
