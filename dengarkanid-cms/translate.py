import json
import time
from deep_translator import GoogleTranslator

def translate_json():
    with open('id_content.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    translator = GoogleTranslator(source='id', target='en')
    
    ignore_keys = {
        'id', 'documentId', 'createdAt', 'updatedAt', 'publishedAt', 'locale',
        'categoryIdentifier', 'category', 'url', 'hash', 'mime', 'ext', 'name',
        'provider', 'folderPath', 'email', 'password', 'width', 'height', 'size',
        'sizeInBytes', 'previewUrl', 'provider_metadata', 'firstname', 'lastname',
        'username', 'resetPasswordToken', 'registrationToken', 'blocked', 'isActive',
        'preferedLanguage', 'date', 'authorName', 'layoutStyle', 'slug', 'row', 'cardColor'
    }

    def translate_value(val):
        if not isinstance(val, str):
            return val
        if len(val.strip()) == 0:
            return val
            
        try:
            res = translator.translate(val)
            if res:
                return res
        except Exception as e:
            print(f"Failed to translate: {val[:30]}... error: {e}")
            time.sleep(2) # Backoff
            try:
                res = translator.translate(val)
                if res:
                    return res
            except:
                pass
        return val

    def traverse(obj, parent_key=None):
        if isinstance(obj, dict):
            new_obj = {}
            for k, v in obj.items():
                if k == 'locale':
                    new_obj[k] = 'en'
                elif k in ignore_keys:
                    new_obj[k] = v
                elif isinstance(v, (dict, list)):
                    new_obj[k] = traverse(v, k)
                elif isinstance(v, str):
                    new_obj[k] = translate_value(v)
                    print(f"Translated [{k}]: {v[:20]} -> {new_obj[k][:20]}")
                else:
                    new_obj[k] = v
            return new_obj
        elif isinstance(obj, list):
            return [traverse(item, parent_key) for item in obj]
        else:
            return obj

    print("Translating data...")
    en_data = traverse(data)
    
    with open('en_content.json', 'w', encoding='utf-8') as f:
        json.dump(en_data, f, indent=2)
    print("Saved to en_content.json")

if __name__ == '__main__':
    translate_json()
