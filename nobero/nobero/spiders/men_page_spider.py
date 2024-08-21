import scrapy
from scrapy.http import Request
from nobero.items import ProductItem

class MenPageSpider(scrapy.Spider):
    name = "men_page"
    allowed_domains = ["nobero.com"]
    start_urls = ["https://nobero.com/pages/men", "https://nobero.com/collections/mens-oversized-tees?page=1&section_id=template--16047755788454__product-grid"]

    def parse(self, response):
        # Extract the product links from the current page
        item_links = response.css('a.product_link ::attr(href)').getall()

        for link in item_links:
            yield Request(
                url=response.urljoin(link),
                callback=self.parse_product
            )

        # Extract the current page number from the URL
        if 'page=' in response.url:
            current_page = int(response.url.split('page=')[1].split('&')[0])
        else:
            current_page = 1

        # Construct the next page URL
        next_page_url = f"https://nobero.com/collections/mens-oversized-tees?page={current_page + 1}&section_id=template--16047755788454__product-grid"

        # Check if the next page contains any products
        if item_links:
            yield scrapy.Request(url=next_page_url, callback=self.parse)
    def parse_product(self, response):
        item = ProductItem()

        # Extracting product details
        item["last_7_day_sale"] = ""
        item['title'] = response.css('h1::text').get().strip()
        item['price'] = response.css('h2#variant-price spanclass::text').get().strip()
        item['mrp'] = response.css('span#variant-compare-at-price spanclass::text').get().strip()
        item['url'] = response.url
        last_7_day = response.css('div.product_bought_count span::text')
        if last_7_day:
            item["last_7_day_sale"] = last_7_day.re(r'\d+')[0]
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
