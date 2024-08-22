# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
import os
import django
import logging
import sys
from asgiref.sync import sync_to_async


sys.path.append(os.path.join(os.path.dirname(__file__), '../../noberoapi'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'noberoapi.settings')
django.setup()

from scraper.models import Product

logger = logging.getLogger(__name__)

class DjangoPipeline:

    def open_spider(self, spider):
        logger.debug(f"Spider opened: {spider.name}")
    
    @sync_to_async
    def save_item(self, item):
        try:
            logger.info(f"Processing item: {item.get('title', 'No Title')}")

            # Save the scraped data into the Django model
            product, created = Product.objects.get_or_create(
                url=item['url'],
                defaults={
                    'title': item['title'],
                    'price': item['price'],
                    'mrp': item['mrp'],
                    'last_7_day_sale': item['last_7_day_sale'],
                    'available_skus': item['available_skus'],
                    'description': item['description'],
                    'specifications': item['specifications'],
                    'img':item["img"],
                }
            )
            if not created:
                product.title = item['title']
                product.price = item['price']
                product.mrp = item['mrp']
                product.last_7_day_sale = item['last_7_day_sale']
                product.available_skus = item['available_skus']
                product.description = item['description']
                product.specifications = item['specifications']
                product.img = item["img"]
                product.save()

            logger.info(f"Item saved: {product}")
            return item
        except Exception as e:
            logger.error(f"Failed to save item: {item} with error {e}")

    async def process_item(self, item, spider):
        logger.debug(f"Processing item: {item}")
        await self.save_item(item)
        return item
    
    def close_spider(self, spider):
        logger.debug(f"Spider closed: {spider.name}")