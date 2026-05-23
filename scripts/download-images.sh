#!/bin/bash
# Download all destination photos for the NZ trip app
# Run this script from the project root directory:
#   chmod +x scripts/download-images.sh && ./scripts/download-images.sh

set -e
DIR="assets/images"
mkdir -p "$DIR"

echo "Downloading destination photos..."

download() {
  local file="$1"
  local url="$2"
  if [ -f "$DIR/$file" ]; then
    echo "  ✓ $file (exists)"
  else
    echo "  ↓ $file"
    curl -sL -o "$DIR/$file" "$url" && echo "  ✓ $file" || echo "  ✗ $file FAILED"
  fi
}

# Day 25
download "sg_airport.jpg" "https://media-cdn.tripadvisor.com/media/photo-m/1280/19/da/59/77/vibrant-hustle-and-bustle.jpg"

# Day 26
download "riverside_market.jpg" "https://media-cdn.tripadvisor.com/media/photo-m/1280/19/da/59/77/vibrant-hustle-and-bustle.jpg"
download "countdown.jpg" "https://www.fmcgbusiness.co.nz/wp-content/uploads/2022/09/Untitled-design-2022-09-08T162848.129.jpg"

# Day 27
download "geraldine.jpg" "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/e7/55/ba/rangitata-valley-mesopotamia.jpg?w=1200&h=-1&s=1"
download "fairlie_bakehouse.jpg" "https://www.thepress.co.nz/media/images/9Tzi8ywRz924XE3uHaD6DZ3Ef+IdbOiYlvIROR5vlqUeRrexTocZGobKRJ9od%2Fgnk3B%2FCeKTmTAsIjj6Q0YaYYSvc%2FUtjfFtPzbW6rTQmOliSlV9FjGgjpLH8e6gk17WcnSBEDo9lPPtqQ9ic4Lj9yjviG%2F9RKuoCqOMrVWlsB13Ztj4bpB0j7RRM2Zq8noVPxMXtMW5itxswFwp11ABBQ=="
download "tekapo_lake.jpg" "https://media.istockphoto.com/id/1550421607/photo/lake-tekapo.jpg?s=612x612&w=0&k=20&c=ydobpTOhodDpzzSVh7A4LX75kEzeYhAFqzZD_zfLrxo="
download "astro_cafe.jpg" "https://res.klook.com/image/upload/w_750,h_469,c_fill,q_85/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/xc7thc3ueuexoe6mxzzz.jpg"
download "church_good_shepherd.jpg" "https://images.vocus.cc/2fbb0aa8-6fb0-4561-8bfb-19554da9620a.jpg"
download "kohan_restaurant.jpg" "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/12/83/75/caption.jpg?w=1100&h=1100&s=1"
download "tekapo_stargazing.jpg" "https://res.klook.com/image/upload/w_750,h_469,c_fill,q_85/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/xc7thc3ueuexoe6mxzzz.jpg"

# Day 28
download "lake_pukaki.jpg" "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/14/fa/61/13/lake-pukaki.jpg?w=900&h=500&s=1"
download "alpine_salmon.jpg" "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1b/e7/9c/f4/shop-counter.jpg?w=900&h=500&s=1"
download "tasman_glacier.jpg" "https://res.klook.com/image/upload/w_750,h_469,c_fill,q_85/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/o37auooedcjodlayjfcr.jpg"
download "hermitage_hotel.jpg" "https://hermitage.canterbury-hotels.com/data/Images/OriginalPhoto/17094/1709482/1709482867/aoraki-mount-cook-the-hermitage-hotel-mt-cook-image-48.JPEG"

# Day 29
download "tasman_morning.jpg" "https://cdn.getyourguide.com/image/format=auto,fit=crop,gravity=auto,quality=60,width=1210,dpr=1/tour_img/5d0807d1eabc4.jpeg"
download "high_country_salmon.jpg" "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/10/7a/9b/7b/fresh-high-country-sashimi.jpg?w=1200&h=-1&s=1"
download "clay_cliffs.jpg" "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/85/49/b4/caption.jpg?w=900&h=500&s=1"
download "puzzling_world.jpg" "https://media-cdn.tripadvisor.com/media/photo-s/0a/03/df/36/photo1jpg.jpg"

# Day 30
download "cardrona_bra_fence.jpg" "https://celiamrg.com/wp-content/uploads/20190826002805_41-768x576.jpg"
download "crown_range.jpg" "https://img.fun-life.com.tw/webp/new-zealand/crown-range-road-scenic-lookout/crown-range-road-scenic-lookout.jpg.webp"
download "kawarau_bridge.jpg" "https://res.klook.com/image/upload/fl_lossy.progressive,q_65/w_1080/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/wyimurpzp018abxcbluf.webp"
download "skyline_gondola.jpg" "https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/07/c2/5f/65.jpg"

# Day 31
download "glenorchy_road.jpg" "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/01/f0/c1/13/scenic-overlook-of-lake.jpg?w=1000&h=-1&s=1"
download "bennetts_bluff.jpg" "https://runningwithmiles.boardingarea.com/wp-content/uploads/2022/02/AdobeStock_187428164-scaled.jpeg"
download "mrs_woollys.jpg" "https://img.gototravel.tw/webp/2019/newzealand/Queentown/Mrs-Woollys-General-Store/Mrs-Woollys-General-Store-21.jpg.webp"
download "queenstown_lakefront.jpg" "https://www.petitfute.com/medias/mag/41846/originale/AdobeStock_238212130-1024x683.jpeg"

# Day 1 (Jun)
download "cromwell_fruit.jpg" "https://journey.tw/wp-content/uploads/2023-05-21-120416-59.jpg"
download "high_country_salmon_lunch.jpg" "https://scontent.fmkz1-2.fna.fbcdn.net/v/t39.30808-6/489820282_9785441701511972_7823311896509728759_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=bexX29bilmEQ7kNvwH-F8-X&_nc_oc=AdrxrhxGvwsx3of9NJCYN8oWYQCpdoitqd8cIbuxhGedZ-0oJ9kc8eFKZdf2cotrR1YHWBMDA4GJLZ77KCaKF3Bo&_nc_zt=23&_nc_ht=scontent.fmkz1-2.fna&_nc_gid=2Zg7DsAsNUjalzdGQumwDQ&_nc_ss=7b2a8&oh=00_Af4IvkCxrXNme1mEt4a7KL5R-0YymZUAV3UkJATIMoS5Yg&oe=6A17BEB0"
download "elephant_rocks.jpg" "https://img.fun-life.com.tw/webp/new-zealand/oamaru-elephant-rocks/DSC09791.jpg.webp"
download "blue_penguin.jpg" "https://www.fittravel.com.au/wp-content/uploads/phillip-island-1.jpg"

# Day 2 (Jun)
download "caroline_bay.jpg" "https://www.cplay.co.nz/images/LetsPlay-CPlay-Caroline-Bay-Playground-HeroImage-220304.jpg"
download "rakaia_salmon.jpg" "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/79/34/6a/salmon-statue.jpg?w=1100&h=-1&s=1"
download "golden_hotel.jpg" "https://cf.bstatic.com/xdata/images/hotel/max1024x768/337365837.jpg?k=10d87027273f4f6f90a98c1a07cc4c6d0d8129f06da5257f6c2cf95bd680769b&o="

# Day 3 (Jun)
download "botanic_gardens.jpg" "https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/06/f2/69/f1.jpg"
download "margaret_mahy.jpg" "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/d4/2b/ed/arghyakolkata-margaret.jpg?w=700&h=400&s=1"
download "cardboard_cathedral.jpg" "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/6f/5e/e1/side-view.jpg?w=1200&h=-1&s=1"
download "sudima_hotel.jpg" "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/24/17/7c/de/hotel-exterior.jpg?w=900&h=500&s=1"
download "spitfire_square.jpg" "https://christchurch.imagevault.media/publishedmedia/er7yy6230uhkfj191g00/TEST_170608_HD_SPITFIRESQUARERETAIL_-9-_-Large-.jpg"

# Day 4 (Jun)
download "singapore_return.jpg" "https://www.agoda.com/wp-content/uploads/2024/08/Featured-image-Reasons-to-travel-Singapore-1244x700.jpg"

# Hero cover
download "hero_cover.jpg" "https://www.majordomo.co.nz/wp-content/uploads/adobestock_231275108-1-900x675.jpeg"

echo ""
echo "Done! Downloaded to $DIR/"
echo "Now commit and push to deploy."
