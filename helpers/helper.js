export function capitalize(name) {
    if (name) {
       const newName = name.charAt(0).toUpperCase();
       return newName + name.slice(1);
  }
}