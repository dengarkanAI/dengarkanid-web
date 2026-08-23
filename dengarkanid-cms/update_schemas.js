const fs = require('fs');
const glob = require('glob');

// Fields to skip localizing
const skipFields = ['categoryIdentifier', 'slug', 'publishedAt', 'createdAt', 'updatedAt', 'published_at', 'created_at', 'updated_at', 'uid'];

function processSchema(filePath) {
  const schema = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let modified = false;

  // Ensure collection itself is localized
  if (schema.pluginOptions?.i18n?.localized) {
    for (const [key, attr] of Object.entries(schema.attributes)) {
      if (
        (attr.type === 'string' || attr.type === 'text' || attr.type === 'richtext' || attr.type === 'component' || attr.type === 'dynamiczone') &&
        !skipFields.includes(key) &&
        !attr.pluginOptions?.i18n?.localized
      ) {
        if (!attr.pluginOptions) attr.pluginOptions = {};
        if (!attr.pluginOptions.i18n) attr.pluginOptions.i18n = {};
        attr.pluginOptions.i18n.localized = true;
        modified = true;
      }
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, JSON.stringify(schema, null, 2) + '\n');
    console.log('Updated ' + filePath);
  }
}

// Also process components
function processComponent(filePath) {
  const schema = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let modified = false;

  for (const [key, attr] of Object.entries(schema.attributes)) {
    if (
      (attr.type === 'string' || attr.type === 'text' || attr.type === 'richtext') &&
      !skipFields.includes(key) &&
      !attr.pluginOptions?.i18n?.localized
    ) {
      if (!attr.pluginOptions) attr.pluginOptions = {};
      if (!attr.pluginOptions.i18n) attr.pluginOptions.i18n = {};
      attr.pluginOptions.i18n.localized = true;
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, JSON.stringify(schema, null, 2) + '\n');
    console.log('Updated component ' + filePath);
  }
}

// Find all collection schemas
glob.sync('src/api/**/schema.json').forEach(processSchema);
glob.sync('src/components/**/*.json').forEach(processComponent);
