const fs = require('fs');
const path = require('path');

const skipFields = ['categoryIdentifier', 'slug', 'publishedAt', 'createdAt', 'updatedAt', 'published_at', 'created_at', 'updated_at', 'uid'];

function processSchema(filePath) {
  const schema = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let modified = false;

  // For collections
  if (schema.pluginOptions?.i18n?.localized || schema.collectionName?.startsWith('components_')) {
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

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(path.join(dir, f));
    }
  });
}

walkDir('src/api', (f) => {
  if (f.endsWith('schema.json')) processSchema(f);
});

walkDir('src/components', (f) => {
  if (f.endsWith('.json')) processSchema(f);
});

console.log('Done');
