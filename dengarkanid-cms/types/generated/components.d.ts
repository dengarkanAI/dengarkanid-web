import type { Schema, Struct } from '@strapi/strapi';

export interface FeatureCarouselItem extends Struct.ComponentSchema {
  collectionName: 'components_feature_carousel_items';
  info: {
    description: '';
    displayName: 'Carousel Item';
    icon: 'images';
  };
  attributes: {
    description: Schema.Attribute.RichText &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    subtitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface SharedSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_links';
  info: {
    description: 'Component for dynamic social media links and icons';
    displayName: 'Social Link';
  };
  attributes: {
    iconClass: Schema.Attribute.String;
    iconMedia: Schema.Attribute.Media<'images'>;
    platformName: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'LinkedIn'>;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'feature.carousel-item': FeatureCarouselItem;
      'shared.social-link': SharedSocialLink;
    }
  }
}
