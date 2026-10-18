function isRelativeBare(specifier) {
  return (
    (specifier.startsWith("./") || specifier.startsWith("../")) &&
    !/\.(?:mjs|cjs|js|ts|json)$/.test(specifier)
  );
}

export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context);
  } catch (error) {
    if (!isRelativeBare(specifier)) throw error;
    return nextResolve(`${specifier}.ts`, context);
  }
}
