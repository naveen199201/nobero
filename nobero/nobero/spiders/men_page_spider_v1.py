import scrapy
from scrapy_splash import SplashRequest

class MenPageSpider(scrapy.Spider):
    name = "men_page_v1"
    allowed_domains = ["nobero.com"]
    start_urls = ["https://nobero.com/pages/men"]

    # Lua script to handle infinite scrolling
    script = """
        function main(splash, args)
            local scroll_to = splash:jsfunc("window.scrollTo")
            local get_body_height = splash:jsfunc("function() {return document.body.scrollHeight;}")
            local body_height = get_body_height()
            
            splash:set_viewport_full()

            for _ = 1, 10 do
                scroll_to(0, body_height)
                splash:wait(2)
                local new_height = get_body_height()

                if new_height == body_height then
                    break
                end

                body_height = new_height
            end

            return {
                html = splash:html(),
            }
        end
    """

    def start_requests(self):
        for url in self.start_urls:
            yield SplashRequest(url, self.parse, endpoint='execute', args={'lua_source': self.script})

    def parse(self, response):
        # Select all the links to individual items
        item_links = response.css('a.product_link ::attr(href)').getall()

        # Yield the full URLs of the items
        for link in item_links:
            yield {
                'url': response.urljoin(link),
            }

        # Optionally, check if there's a "next page" and continue scraping
        # (Note: This depends on how the infinite scroll is implemented on the site.)
