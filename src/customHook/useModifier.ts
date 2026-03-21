export default function useModifier(
  styles: CSSModuleClasses,
  mainClass: string,
  modifierClasses: { [key: string]: boolean }
): string {
  let classes = styles[mainClass] || '';

  Object.entries(modifierClasses).forEach(([key, value]) => {
    if (value) {
      classes += ` ${styles[`${mainClass}_${key}`]}`;
    }
  });

  return classes;
}
