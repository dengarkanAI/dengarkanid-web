import type { Schema, Struct } from '@strapi/strapi';

export interface FeatureCarouselItem extends Struct.ComponentSchema {
  collectionName: 'components_feature_carousel_items';
  info: {
    description: '';
    displayName: 'Carousel Item';
    icon: 'images';
  };
  attributes: {
    description: Schema.Attribute.RichText;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    subtitle: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'feature.carousel-item': FeatureCarouselItem;
    }
  }
}
