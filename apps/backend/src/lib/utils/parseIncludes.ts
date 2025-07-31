import {
  Model, Includeable, ModelStatic, FindAttributeOptions,
} from 'sequelize';

interface Options {
  models: {
    identifier: string
    model: ModelStatic<Model>
    attributes?: FindAttributeOptions
    as?: string
  }[];
}

interface ReturnType {
  includedModels: Includeable[]
  includedIdentifiers: string[]
}

function parseIncludes(includeString: string, options: Options): ReturnType | null {
  if (!includeString) return null;

  const includesArr = includeString.split(',');
  const includedIdentifiers: string[] = [];

  const includedModels: Includeable[] = [];

  options.models.forEach((item) => {
    if (includesArr.includes(item.identifier)) {
      includedModels.push({
        model: item.model,
        attributes: item.attributes,
        as: item.as,
      });

      includedIdentifiers.push(`${item.identifier}Id`);
    }
  });

  return { includedModels, includedIdentifiers };
}

export default parseIncludes;
