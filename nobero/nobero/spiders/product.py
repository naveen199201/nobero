import scrapy
from nobero.items import ProductItem

class ProductSpider(scrapy.Spider):
    name = "product_spider"
    allowed_domains = ["nobero.com"]
    start_urls = [
        "https://nobero.com/products/dimensions-oversized-t-shirt"
    ]

    def parse(self, response):
        # Create an instance of the ProductItem
        item = ProductItem()

        # Extracting product details
        item['title'] = response.css('h1::text').get().strip()
        item['price'] = response.css('h2#variant-price spanclass::text').get().strip()
        item['mrp'] = response.css('span#variant-compare-at-price spanclass::text').get().strip()
        item['url'] = response.url
        item["last_7_day_sale"] = response.css('div.product_bought_count span::text').re(r'\d+')[0]
        colors = response.css("input.variant-color-input ::attr(value)").getall()
        sizes = response.css("input.size-select-input ::attr(value)").getall()
        item['description'] = response.css("div#description_content p").xpath('string(.)').get().strip()
        item['available_skus'] = {'colors':colors,'sizes':sizes} 
        specifications = {}
        spec_sections = response.css('div.product-metafields-values')

        for section in spec_sections:
            # Extract the label (e.g., "Fit")
            label = section.css('h4::text').get().strip().replace(" ", "_").lower()

            # Extract the value (e.g., "Oversized Fit")
            value = section.css('p::text').get().strip()

            # Add to the specifications dictionary
            specifications[label] = value

        # Store the specifications in the item
        item['specifications'] = specifications

        yield item
