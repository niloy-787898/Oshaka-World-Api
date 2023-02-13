import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './pages/user/user.module';
import { AdminModule } from './pages/admin/admin.module';
import { UtilsModule } from './shared/utils/utils.module';
import { ReviewModule } from './pages/review/review.module';
import { ProductModule } from './pages/product/product.module';
import { CategoryModule } from './pages/catalog/category/category.module';
import { BlogListModule } from './pages/blog-list/blog-list.module';
import { StoreInfoModule } from './pages/customization/store-info/store-info.module';
import { BrandModule } from './pages/catalog/brand/brand.module';
import { VariationModule } from './pages/catalog/variation/variation.module';
import { BlogModule } from './pages/blog/blog.module';
import { WishListModule } from './pages/wish-list/wish-list.module';
import { UploadModule } from './pages/upload/upload.module';
import { DbToolsModule } from './shared/db-tools/db-tools.module';
import { ShippingChargeModule } from './pages/sales/shipping-charge/shipping-charge.module';
import { FileFolderModule } from './pages/galleries/file-folder/file-folder.module';
import { PromoOfferModule } from './pages/offers/promo-offer/promo-offer.module';
import { TechnologyModule } from './pages/technology/technology.module';
import { GalleryModule } from './pages/galleries/gallery/gallery.module';
import { TagModule } from './pages/catalog/tag/tag.module';
import { ContactUsModule } from './pages/contacts/contact-us/contact-us.module';
import { NewsletterModule } from './pages/contacts/newsletter/newsletter.module';
import { CategoryMenuModule } from './pages/customization/category-menu/category-menu.module';
import { JobSchedulerModule } from './shared/job-scheduler/job-scheduler.module';
import { CarouselModule } from './pages/customization/carousel/carousel.module';
import { SettingModule } from './pages/setting/setting.module';
import { AdditionalPageModule } from './pages/additional-page/additional-page.module';
import { OrderModule } from './pages/sales/order/order.module';
import { SubCategoryModule } from './pages/catalog/sub-category/sub-category.module';
import { ShopInformationModule } from './pages/customization/shop-information/shop-information.module';
import { CouponModule } from './pages/offers/coupon/coupon.module';
import { CartModule } from './pages/cart/cart.module';
import { OtpModule } from './pages/otp/otp.module';
import { BulkSmsModule } from './shared/bulk-sms/bulk-sms.module';
import { DashboardModule } from './pages/dashboard/dashboard.module';
import { StoryModule } from './pages/customization/story/story.module';
import { PopupModule } from './pages/customization/popup/popup.module';
import { PdfMakerModule } from './shared/pdf-maker/pdf-maker.module';
import { EmailModule } from './shared/email/email.module';
import { AppVersionModule } from './pages/app-version/app-version.module';
import { FooterDataModule } from './pages/footer-data/footer-data.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRoot(configuration().mongoCluster),
    CacheModule.register({ ttl: 200, max: 10, isGlobal: true }),
    AdminModule,
    UserModule,
    UtilsModule,
    BulkSmsModule,
    DbToolsModule,
    ProductModule,
    CategoryModule,
    SubCategoryModule,
    BrandModule,
    TagModule,
    UploadModule,
    FileFolderModule,
    GalleryModule,
    OrderModule,
    CarouselModule,
    ShippingChargeModule,
    StoreInfoModule,
    NewsletterModule,
    ContactUsModule,
    PromoOfferModule,
    // DealOnPlayModule,
    // DealsOfTheDayModule,
    // FeaturedProductModule,
    // OfferProductModule,
    SettingModule,
    // FlashSaleModule,
    VariationModule,
    ShopInformationModule,
    CategoryMenuModule,
    AdditionalPageModule,
    BlogModule,
    BlogListModule,
    TechnologyModule,
    JobSchedulerModule,
    CouponModule,
    CartModule,
    WishListModule,
    ReviewModule,
    OtpModule,
    DashboardModule,
    StoryModule,
    PopupModule,
    PdfMakerModule,
    EmailModule,
    AppVersionModule,
    FooterDataModule
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
