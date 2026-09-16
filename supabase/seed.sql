-- ==============================================================================
-- BVS REAL ESTATE - DEMO DATA INSERTION SCRIPT (PHASE 2)
-- ==============================================================================
-- This script populates sample properties and associated image gallery rows.
-- All listings are realistic DEMO examples for testing in Dindigul.
-- Run this in your Supabase SQL Editor after running schema.sql.
-- ==============================================================================

-- Clear existing demo data to prevent duplicates upon re-running
TRUNCATE TABLE public.property_images CASCADE;
TRUNCATE TABLE public.properties CASCADE;

-- 1. INSERT PROPERTIES
INSERT INTO public.properties (
    id,
    title,
    slug,
    location,
    area,
    price,
    price_unit,
    property_type,
    status,
    description,
    highlights,
    maps_url
) VALUES
-- Property 1: AVAILABLE Residential Plot
(
    'a1111111-1111-1111-1111-111111111111',
    'Green Valley Plot',
    'green-valley-plot-dindigul',
    'Palani Road, Dindigul',
    2400,
    1800000,
    'Lakhs',
    'RESIDENTIAL PLOT',
    'AVAILABLE',
    'A prime residential plot situated in a peaceful and developing neighbourhood off Palani Road, Dindigul. Excellent groundwater availability, clear road connectivity, and ideal peaceful atmosphere for building an independent family home or long-term investment.',
    ARRAY[
        'Ready for immediate house construction',
        '30 feet wide tar road frontage',
        'Abundant sweet groundwater source',
        'Quick access to Palani Road bus route & schools',
        'Clear title documents verified by owner'
    ],
    'https://maps.google.com/?q=Palani+Road+Dindigul'
),
-- Property 2: AVAILABLE Residential Plot near Aavin
(
    'a2222222-2222-2222-2222-222222222222',
    'Aavin Road House Plot',
    'aavin-road-house-plot',
    'Near Aavin Palpannai, East Govindapuram, Dindigul',
    1800,
    2600000,
    'Lakhs',
    'RESIDENTIAL PLOT',
    'AVAILABLE',
    'Strategically located residential house site situated in East Govindapuram near Aavin Palpannai. Walking distance to local transport, departmental stores, and primary schools. High residential demand area with well-built houses nearby.',
    ARRAY[
        'Walking distance to Aavin Palpannai & bus stop',
        '24 feet concrete municipal road',
        'Electricity and municipal water lines adjacent',
        'Immediate registration ready',
        'North-facing auspicious entrance plot'
    ],
    'https://maps.google.com/?q=East+Govindapuram+Dindigul'
),
-- Property 3: AVAILABLE House
(
    'a3333333-3333-3333-3333-333333333333',
    'Modern 3BHK Independent House',
    'modern-3bhk-independent-house-dindigul',
    'Chettinaickenpatti, Dindigul',
    2150,
    6500000,
    'Lakhs',
    'HOUSE',
    'AVAILABLE',
    'Brand new architectural 3 BHK independent house built on 4.5 cents of land in Chettinaickenpatti. Features a spacious portico, modern modular kitchen, covered terrace with scenic hill view, and high quality teak wood fittings.',
    ARRAY[
        'Built area 2,150 sq.ft across Ground + 1 floor',
        '3 large bedrooms with attached western bathrooms',
        'Car parking portico for 2 vehicles',
        'Overhead water tank with automatic sensor',
        'Borewell + Corporation drinking water line'
    ],
    'https://maps.google.com/?q=Chettinaickenpatti+Dindigul'
),
-- Property 4: AVAILABLE Agricultural Land
(
    'a4444444-4444-4444-4444-444444444444',
    'Dindigul Agricultural Farm Land',
    'dindigul-agricultural-farm-land',
    'Near Reddiarchatram, Palani Highway, Dindigul',
    152460, -- approx 3.5 acres in sq.ft
    4900000,
    'Lakhs',
    'AGRICULTURAL LAND',
    'AVAILABLE',
    'Fertile 3.5 acres agricultural land with mature coconut trees, free electricity service connection (EB), and functioning open well. Red loamy soil highly suitable for vegetable farming, guava, coconut plantation, or dairy farming.',
    ARRAY[
        '3.5 Acres total extent with fenced perimeter',
        '120 yielding hybrid coconut trees',
        'Free agricultural 3-phase EB connection',
        'Deep open well with steady perennial water table',
        'Only 1.2 km from main Palani highway'
    ],
    'https://maps.google.com/?q=Reddiarchatram+Dindigul'
),
-- Property 5: RESERVED Commercial Property
(
    'a5555555-5555-5555-5555-555555555555',
    'Commercial Corner Site Dindigul',
    'commercial-corner-site-dindigul',
    'Natham Road Junction, Dindigul',
    4800,
    13500000,
    'Crores',
    'COMMERCIAL',
    'RESERVED',
    'High visibility commercial corner land facing the busy Natham Road highway. Massive frontage ideal for commercial showroom, clinic, logistics godown, automobile workshop, or multi-storey commercial complex.',
    ARRAY[
        'Prominent corner frontage on 60 ft main highway',
        'High vehicular movement & excellent customer footfall',
        'Commercial conversion feasible',
        'Close to Dindigul Central Bus Stand (approx. 3.5 km)',
        'Reserved under preliminary negotiation token'
    ],
    'https://maps.google.com/?q=Natham+Road+Dindigul'
),
-- Property 6: SOLD Villa Plot
(
    'a6666666-6666-6666-6666-666666666666',
    'Batlagundu Road Villa Plot',
    'batlagundu-road-villa-plot',
    'Batlagundu Main Road, Dindigul',
    1500,
    1450000,
    'Lakhs',
    'PLOT',
    'SOLD',
    'A fast-appreciating villa plot on Batlagundu road that was successfully sold to a resident building their retirement home. Demonstrates BVS Real Estate track record of connecting sellers and buyers with complete transparent documentation.',
    ARRAY[
        'Successfully closed and registered',
        'Gated community layout with avenue trees',
        'Underground drainage & street electricity',
        'Close to bypass intersection'
    ],
    'https://maps.google.com/?q=Batlagundu+Road+Dindigul'
);

-- 2. INSERT PROPERTY IMAGES
INSERT INTO public.property_images (property_id, image_url, display_order) VALUES
-- Images for Green Valley Plot
('a1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80', 1),
('a1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1592595896551-12b371d546d5?auto=format&fit=crop&w=1200&q=80', 2),
('a1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80', 3),

-- Images for Aavin Road House Plot
('a2222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', 1),
('a2222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', 2),
('a2222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80', 3),

-- Images for Modern 3BHK Independent House
('a3333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80', 1),
('a3333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80', 2),
('a3333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80', 3),

-- Images for Dindigul Agricultural Farm Land
('a4444444-4444-4444-4444-444444444444', 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80', 1),
('a4444444-4444-4444-4444-444444444444', 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1200&q=80', 2),

-- Images for Commercial Corner Site Dindigul
('a5555555-5555-5555-5555-555555555555', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80', 1),
('a5555555-5555-5555-5555-555555555555', 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=1200&q=80', 2),

-- Images for Batlagundu Road Villa Plot
('a6666666-6666-6666-6666-666666666666', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80', 1);
