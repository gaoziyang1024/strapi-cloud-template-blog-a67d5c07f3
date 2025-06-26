import type { Schema, Struct } from '@strapi/strapi';

export interface CommonCdnConfig extends Struct.ComponentSchema {
  collectionName: 'components_common_cdn_configs';
  info: {
    description: 'CDN\u5730\u5740\u548C\u76F8\u5173\u914D\u7F6E\u9009\u9879';
    displayName: 'CDN\u914D\u7F6E';
    icon: 'server';
  };
  attributes: {
    allowedDomains: Schema.Attribute.JSON;
    baseUrl: Schema.Attribute.String & Schema.Attribute.Required;
    cacheSettings: Schema.Attribute.JSON;
    imagePath: Schema.Attribute.String & Schema.Attribute.DefaultTo<'/images'>;
    isEnabled: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface CommonFooter extends Struct.ComponentSchema {
  collectionName: 'components_common_footers';
  info: {
    description: '';
    displayName: 'footer_en';
  };
  attributes: {
    copyright: Schema.Attribute.Text;
    emailContact: Schema.Attribute.Text;
    friend_links: Schema.Attribute.Relation<
      'oneToMany',
      'api::friend-link.friend-link'
    >;
    icp: Schema.Attribute.Text;
    lingin: Schema.Attribute.Text;
    location: Schema.Attribute.Text;
    logo: Schema.Attribute.Media<'images' | 'files'>;
    phoneContact: Schema.Attribute.Text;
    xlinks: Schema.Attribute.String;
  };
}

export interface CommonFooterSettings extends Struct.ComponentSchema {
  collectionName: 'components_common_footer_settings';
  info: {
    displayName: 'footerSettings';
    icon: 'cog';
  };
  attributes: {
    en: Schema.Attribute.Component<'common.footer', false>;
    zhHans: Schema.Attribute.Component<'common.footer-zh-hans', false>;
  };
}

export interface CommonFooterZhHans extends Struct.ComponentSchema {
  collectionName: 'components_common_footer_zh_hans';
  info: {
    displayName: 'footer_zhHans';
  };
  attributes: {
    copyright: Schema.Attribute.Text;
    emailContact: Schema.Attribute.Text;
    friend_links: Schema.Attribute.Relation<
      'oneToMany',
      'api::friend-link.friend-link'
    >;
    icp: Schema.Attribute.Text;
    lingin: Schema.Attribute.Text;
    location: Schema.Attribute.Text;
    logo: Schema.Attribute.Media<'images' | 'files'>;
    phoneContact: Schema.Attribute.Text;
    xlinks: Schema.Attribute.String;
  };
}

export interface CommonHeader extends Struct.ComponentSchema {
  collectionName: 'components_common_headers';
  info: {
    description: '';
    displayName: 'header';
  };
  attributes: {
    logo: Schema.Attribute.Media<'images' | 'files'>;
    route: Schema.Attribute.Component<'common.route', false>;
  };
}

export interface CommonImageCdn extends Struct.ComponentSchema {
  collectionName: 'components_common_image_cdns';
  info: {
    description: '\u56FE\u7247CDN\u5730\u5740\u914D\u7F6E';
    displayName: '\u56FE\u7247CDN';
    icon: 'picture';
  };
  attributes: {
    altText: Schema.Attribute.String;
    cdnUrl: Schema.Attribute.String;
    isOptimized: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    originalUrl: Schema.Attribute.String;
    sizes: Schema.Attribute.JSON;
    thumbnailUrl: Schema.Attribute.String;
  };
}

export interface CommonPictureComponents extends Struct.ComponentSchema {
  collectionName: 'components_common_picture_components';
  info: {
    displayName: 'pictureComponents';
    icon: 'chartBubble';
  };
  attributes: {
    description: Schema.Attribute.Text;
    images: Schema.Attribute.Media<'images' | 'files'>;
    remark: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface CommonRoute extends Struct.ComponentSchema {
  collectionName: 'components_common_routes';
  info: {
    displayName: 'route';
  };
  attributes: {
    nameEN: Schema.Attribute.String & Schema.Attribute.Required;
    nameZhHans: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'common.cdn-config': CommonCdnConfig;
      'common.footer': CommonFooter;
      'common.footer-settings': CommonFooterSettings;
      'common.footer-zh-hans': CommonFooterZhHans;
      'common.header': CommonHeader;
      'common.image-cdn': CommonImageCdn;
      'common.picture-components': CommonPictureComponents;
      'common.route': CommonRoute;
      'shared.media': SharedMedia;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
    }
  }
}
