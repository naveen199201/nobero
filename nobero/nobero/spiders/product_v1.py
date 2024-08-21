import scrapy
from nobero.items import ProductItem


class ProductSpider(scrapy.Spider):
    name = "product_v1_spider"
    allowed_domains = ["nobero.com"]
    start_urls = [
        "https://nobero.com/products/dimensions-oversized-t-shirt"
    ]

    def parse(self, response):
        # Create an instance of the ProductItem
        item = ProductItem()

        # Extracting product details
        item['title'] = response.css('h1::text').get().strip()
        item['price'] = response.css(
            'h2#variant-price spanclass::text').get().strip()
        item['mrp'] = response.css(
            'span#variant-compare-at-price spanclass::text').get().strip()
        item["last_7_day_sale"] = response.css(
            'div.product_bought_count span::text').re(r'\d+')[0]
        color_options = response.css(
            "input.variant-color-input ::attr(value)").getall()
        # sizes = response.css("input.size-select-input ::attr(value)").getall()
        item['description'] = response.css(
            "div#description_content p").xpath('string(.)').get().strip()
        # item['available_skus'] = {'colors':colors,'sizes':sizes}
        specifications = {}
        spec_sections = response.css('div.product-metafields-values')

        for section in spec_sections:
            # Extract the label (e.g., "Fit")
            label = section.css('h4::text').get(
            ).strip().replace(" ", "_").lower()

            # Extract the value (e.g., "Oversized Fit")
            value = section.css('p::text').get().strip()

            # Add to the specifications dictionary
            specifications[label] = value

        # Store the specifications in the item
        item['specifications'] = specifications

        for color in color_options:
            # Send a request for each color option
            color_request = response.urljoin(f"?variant={color}")
            yield scrapy.Request(
                url=color_request,
                callback=self.parse_color_variants,
                meta={'item': item, 'color': color}
            )

    def parse_color_variants(self, response):
        # Retrieve the item and color from the meta data
        item = response.meta['item']
        color = response.meta['color']

        # Extract available sizes for the selected color
        sizes = response.css('input.variant-size-input::attr(value)').getall()

        # Store the sizes in the item under the corresponding color
        if 'color_sizes' not in item:
            item['color_sizes'] = {}
        
        item['color_sizes'][color] = sizes

        # Only yield the item once all colors are processed
        if len(item['color_sizes']) == len(response.css('input.variant-color-input::attr(value)').getall()):
            yield item
