export function queryConvert(parameterizedSql: string, params: {[key: string]: any}) {
  const keys = Object.keys(params);
  const values = Object.values(params);

  let text = parameterizedSql;

  keys.forEach((key, index) => {
    const regex = new RegExp(`\\:${key}\\b`, 'g'); 
    text = text.replace(regex, `$${index + 1}`);
  });
  
  return { text, values };
}