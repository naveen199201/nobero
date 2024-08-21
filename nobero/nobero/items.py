# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy

class ProductItem(scrapy.Item):
    # Define the fields for your item here
    title = scrapy.Field()
    url = scrapy.Field()
    price = scrapy.Field()
    mrp = scrapy.Field()
    last_7_day_sale = scrapy.Field()
    available_skus = scrapy.Field()
    description = scrapy.Field()
    specifications = scrapy.Field()
    # color_sizes = scrapy.Field()
