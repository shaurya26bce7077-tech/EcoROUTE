-- EcoRoute India-wide demo seed data
-- Run schema.sql first. This seed creates demo surplus across major Indian cities.

insert into public.listings
(store_name,title,description,category,quantity,address,lat,lng,is_free,price,expiry_time,pickup_window,status)
values
-- Delhi
('Delhi Community Kitchen','Dal Rice Meal Boxes','Fresh surplus meals available before closing.','Meals',22,'Connaught Place, New Delhi',28.6315,77.2167,true,null,now()+interval '7 hours','5:30 PM - 8:00 PM','available'),
('Green Basket Delhi','Fruit Rescue Boxes','Mixed fruit boxes with cosmetic imperfections.','Fruits',18,'Saket, New Delhi',28.5244,77.2066,false,39,now()+interval '9 hours','6:00 PM - 9:00 PM','available'),
('Campus Cafe Delhi','Paneer Wraps','Fresh wraps that need to be collected today.','Meals',15,'North Campus, Delhi',28.6890,77.2100,true,null,now()+interval '5 hours','4:00 PM - 7:00 PM','available'),

-- Mumbai
('Mumbai Meal Share','Veg Thali Boxes','Surplus vegetarian meals from lunch service.','Meals',30,'Andheri West, Mumbai',19.1364,72.8296,true,null,now()+interval '6 hours','5:00 PM - 8:00 PM','available'),
('FreshCart Mumbai','Bakery Rescue Pack','Bread and buns from today''s batch.','Bakery',20,'Powai, Mumbai',19.1176,72.9060,false,25,now()+interval '10 hours','6:30 PM - 9:30 PM','available'),
('Harbour Fruits','Mixed Fruit Crates','Good-to-eat fruit with minor cosmetic defects.','Fruits',12,'Dadar, Mumbai',19.0178,72.8478,true,null,now()+interval '4 hours','4:00 PM - 6:30 PM','available'),

-- Bengaluru
('Bengaluru Food Circle','Rice Bowl Surplus','Fresh vegetarian rice bowls from today''s service.','Meals',25,'Indiranagar, Bengaluru',12.9784,77.6408,true,null,now()+interval '6 hours','5:30 PM - 8:00 PM','available'),
('Koramangala Bakehouse','Pastry Rescue Box','Assorted pastries discounted before closing.','Bakery',16,'Koramangala, Bengaluru',12.9352,77.6245,false,35,now()+interval '8 hours','7:00 PM - 9:30 PM','available'),
('Green Basket BLR','Vegetable Boxes','Fresh vegetables that are still perfectly usable.','Vegetables',20,'Whitefield, Bengaluru',12.9698,77.7499,true,null,now()+interval '12 hours','6:00 PM - 9:00 PM','available'),

-- Hyderabad
('Hyderabad Community Cafe','Biryani Meal Boxes','Surplus biryani boxes prepared today.','Meals',28,'Banjara Hills, Hyderabad',17.4156,78.4347,true,null,now()+interval '5 hours','5:00 PM - 7:30 PM','available'),
('Deccan Bakery','Bread & Bun Packs','End-of-day bakery surplus.','Bakery',24,'Hitech City, Hyderabad',17.4435,78.3772,false,20,now()+interval '9 hours','6:00 PM - 9:00 PM','available'),
('Fresh Hyderabad','Fruit Rescue Boxes','Mixed seasonal fruits ready for pickup.','Fruits',14,'Madhapur, Hyderabad',17.4483,78.3915,true,null,now()+interval '7 hours','5:30 PM - 8:30 PM','available'),

-- Chennai
('Chennai Food Share','South Indian Meal Boxes','Fresh idli, rice and vegetable meal boxes.','Meals',26,'T Nagar, Chennai',13.0418,80.2341,true,null,now()+interval '5 hours','4:30 PM - 7:00 PM','available'),
('Marina Bakery','Bread Rescue Packs','Fresh bread packs from today''s production.','Bakery',19,'Adyar, Chennai',13.0012,80.2565,false,25,now()+interval '10 hours','6:00 PM - 9:00 PM','available'),

-- Kolkata
('Kolkata Community Kitchen','Rice & Curry Boxes','Surplus vegetarian lunch boxes.','Meals',20,'Salt Lake, Kolkata',22.5804,88.4124,true,null,now()+interval '6 hours','5:00 PM - 8:00 PM','available'),
('Howrah Fresh Mart','Fruit Rescue Packs','Good quality fruit with cosmetic imperfections.','Fruits',15,'Howrah, Kolkata',22.5958,88.2636,true,null,now()+interval '8 hours','5:30 PM - 8:30 PM','available'),

-- Pune
('Pune Food Circle','Poha & Meal Boxes','Fresh breakfast surplus packed for pickup.','Meals',18,'Kothrud, Pune',18.5074,73.8077,true,null,now()+interval '5 hours','4:00 PM - 6:30 PM','available'),
('Deccan Bakehouse','Pastry Boxes','Assorted bakery items at a rescue price.','Bakery',17,'Viman Nagar, Pune',18.5679,73.9143,false,30,now()+interval '9 hours','6:30 PM - 9:00 PM','available'),

-- Ahmedabad
('Ahmedabad Food Share','Gujarati Meal Boxes','Fresh surplus thali boxes.','Meals',21,'Navrangpura, Ahmedabad',23.0395,72.5610,true,null,now()+interval '6 hours','5:00 PM - 8:00 PM','available'),
('Sabarmati Fresh','Fruit Rescue Boxes','Mixed fruit boxes ready for pickup.','Fruits',13,'Satellite, Ahmedabad',23.0302,72.5185,true,null,now()+interval '7 hours','5:30 PM - 8:30 PM','available'),

-- Jaipur
('Pink City Kitchen','Roti & Curry Boxes','Surplus vegetarian dinner portions.','Meals',24,'C-Scheme, Jaipur',26.9124,75.7873,true,null,now()+interval '6 hours','5:30 PM - 8:00 PM','available'),
('Jaipur Bakehouse','Bread Rescue Packs','Fresh bread from today''s batch.','Bakery',20,'Malviya Nagar, Jaipur',26.8500,75.8069,false,22,now()+interval '10 hours','6:00 PM - 9:00 PM','available'),

-- Lucknow
('Lucknow Food Circle','Veg Meal Boxes','Fresh surplus home-style meals.','Meals',23,'Gomti Nagar, Lucknow',26.8467,81.0000,true,null,now()+interval '5 hours','5:00 PM - 7:30 PM','available'),
('Awadh Fresh Mart','Fruit Rescue Boxes','Seasonal fruits available for quick pickup.','Fruits',16,'Hazratganj, Lucknow',26.8509,80.9490,true,null,now()+interval '8 hours','5:30 PM - 8:30 PM','available'),

-- Vijayawada / Amaravati
('Green Leaf Cafe','Veg Biryani Boxes','Fresh surplus lunch boxes prepared today.','Meals',18,'VIT-AP Campus, Amaravati',16.4865,80.5107,true,null,now()+interval '7 hours','5:30 PM - 8:00 PM','available'),
('Campus Bakery','Fresh Bread Packs','Whole-wheat bread packs left from today''s batch.','Bakery',24,'Near VIT-AP Main Gate',16.4890,80.5124,false,29,now()+interval '9 hours','6:00 PM - 9:00 PM','available'),
('Amaravati Fresh Mart','Mixed Fruit Boxes','Bananas, apples and oranges with minor cosmetic defects.','Fruits',12,'Amaravati Market Road',16.4842,80.5079,true,null,now()+interval '5 hours','4:00 PM - 7:00 PM','available'),

-- Chandigarh
('Chandigarh Community Kitchen','Meal Rescue Boxes','Fresh vegetarian meal boxes for pickup.','Meals',20,'Sector 17, Chandigarh',30.7415,76.7821,true,null,now()+interval '6 hours','5:00 PM - 8:00 PM','available'),
('City Bakehouse','Bread & Pastry Pack','Bakery surplus from today''s batch.','Bakery',18,'Sector 35, Chandigarh',30.7216,76.7590,false,25,now()+interval '9 hours','6:30 PM - 9:00 PM','available'),

-- Kochi
('Kochi Food Circle','Kerala Meal Boxes','Fresh vegetarian meals available for pickup.','Meals',20,'Ernakulam, Kochi',9.9816,76.2999,true,null,now()+interval '6 hours','5:00 PM - 8:00 PM','available'),
('Cochin Fresh Mart','Fruit Rescue Boxes','Fresh fruit boxes before closing.','Fruits',14,'Edappally, Kochi',10.0261,76.3125,true,null,now()+interval '8 hours','5:30 PM - 8:30 PM','available'),

-- Bhopal
('Bhopal Food Share','Meal Rescue Boxes','Surplus vegetarian meals prepared today.','Meals',19,'MP Nagar, Bhopal',23.2336,77.4340,true,null,now()+interval '6 hours','5:00 PM - 8:00 PM','available'),
('Lake City Bakery','Bread Rescue Pack','Fresh bakery items before closing.','Bakery',15,'Arera Colony, Bhopal',23.2140,77.4340,false,20,now()+interval '9 hours','6:00 PM - 9:00 PM','available')
;
