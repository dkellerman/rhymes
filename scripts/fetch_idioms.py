import requests
import bs4
from tqdm import tqdm
import os

def get_items(page_num):
    url = "https://www.theidioms.com/list/page/%d/" % page_num
    resp = requests.get(url)
    resp.encoding = "utf-8-sig"

    soup = bs4.BeautifulSoup(resp.text, 'html.parser')
    item_els = soup.find_all('dt')
    items = []
    for item_el in item_els:
        item = dict()
        link = item_el.find('a')
        item['value'] = link.text.replace(u'\ufeff', '').lower().strip()
        item['source'] = link['href']
        item['id'] = item['source'].split('/')[-2:-1][0]
        items += [item]
    return items


if __name__ == '__main__':
    fn = os.path.join(os.path.dirname(__file__), '../data/idioms.txt')
    with open(fn, mode='w', encoding='utf8') as f:
        for page_num in tqdm(range(1, 126)):
            f.write('\n'.join([ i['value'] for i in get_items(page_num) ]))
            f.write('\n')

