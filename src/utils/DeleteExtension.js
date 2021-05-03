export function DeleteExtension(str) {
   return str.substr(0, str.lastIndexOf(".")) || str;
}
