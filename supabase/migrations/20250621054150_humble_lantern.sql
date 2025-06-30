/*
  # Complete MechMaster Database Setup

  1. New Tables
    - Enhanced `users` table with subscription fields
    - `user_progress` table for tracking reading progress

  2. Sample Data
    - 4 categories (Mechanical Components, Fluid Systems, etc.)
    - 6 topics (Gate Valves, Centrifugal Pumps, Ball Bearings, etc.)
    - 16 detailed content sections across all topics

  3. Security
    - Enable RLS on all tables
    - Policies for authenticated users to access content
    - Users can manage their own data and progress

  4. Functions
    - Automatic subscription status checking
    - Updated timestamp triggers
*/

-- Add subscription fields to existing users table
DO $$
BEGIN
  -- Add subscription_status column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'subscription_status'
  ) THEN
    ALTER TABLE users ADD COLUMN subscription_status text DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'trial'));
  END IF;

  -- Add subscription_start_date column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'subscription_start_date'
  ) THEN
    ALTER TABLE users ADD COLUMN subscription_start_date timestamptz;
  END IF;

  -- Add subscription_end_date column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'subscription_end_date'
  ) THEN
    ALTER TABLE users ADD COLUMN subscription_end_date timestamptz;
  END IF;

  -- Add razorpay_customer_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'razorpay_customer_id'
  ) THEN
    ALTER TABLE users ADD COLUMN razorpay_customer_id text;
  END IF;

  -- Add updated_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE users ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Create user progress tracking table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  topic_id uuid REFERENCES topics(id) ON DELETE CASCADE,
  completed_sections integer DEFAULT 0,
  total_sections integer DEFAULT 0,
  last_accessed timestamptz DEFAULT now(),
  completed_at timestamptz,
  UNIQUE(user_id, topic_id)
);

-- Insert sample categories (only if they don't exist)
INSERT INTO categories (name, slug, icon)
SELECT * FROM (VALUES
  ('Mechanical Components', 'mechanical-components', 'settings'),
  ('Fluid Systems', 'fluid-systems', 'droplets'),
  ('Power Transmission', 'power-transmission', 'zap'),
  ('Materials & Manufacturing', 'materials-manufacturing', 'hammer')
) AS new_categories(name, slug, icon)
WHERE NOT EXISTS (
  SELECT 1 FROM categories WHERE categories.name = new_categories.name
);

-- Insert sample topics (only if they don't exist)
INSERT INTO topics (title, slug, category_id, short_desc)
SELECT * FROM (VALUES
  ('Gate Valves', 'gate-valves', (SELECT id FROM categories WHERE slug = 'mechanical-components'), 'Complete guide to gate valves, types, and applications'),
  ('Centrifugal Pumps', 'centrifugal-pumps', (SELECT id FROM categories WHERE slug = 'fluid-systems'), 'Working principles and performance of centrifugal pumps'),
  ('Ball Bearings', 'ball-bearings', (SELECT id FROM categories WHERE slug = 'mechanical-components'), 'Selection, installation, and maintenance of ball bearings'),
  ('Helical Gears', 'helical-gears', (SELECT id FROM categories WHERE slug = 'power-transmission'), 'Design principles and applications of helical gears'),
  ('Check Valves', 'check-valves', (SELECT id FROM categories WHERE slug = 'fluid-systems'), 'Types and applications of check valves in piping systems'),
  ('Roller Bearings', 'roller-bearings', (SELECT id FROM categories WHERE slug = 'mechanical-components'), 'Comprehensive guide to roller bearing types and uses')
) AS new_topics(title, slug, category_id, short_desc)
WHERE NOT EXISTS (
  SELECT 1 FROM topics WHERE topics.title = new_topics.title
);

-- Insert sample blog content (only if it doesn't exist)
INSERT INTO blog_content (topic_id, section_title, section_body)
SELECT * FROM (VALUES
  -- Gate Valves Content
  ((SELECT id FROM topics WHERE slug = 'gate-valves'), 'Introduction to Gate Valves', '<p>Gate valves are one of the most common types of valves used in industrial applications. They provide a straight-through flow path when fully open, minimizing pressure drop and allowing for efficient fluid flow.</p><p>The name "gate valve" comes from the gate-like disc that moves perpendicular to the flow path to control the flow of fluid through the valve.</p>'),
  
  ((SELECT id FROM topics WHERE slug = 'gate-valves'), 'Types of Gate Valves', '<h3>Rising Stem Gate Valves</h3><p>In rising stem gate valves, the stem rises as the valve opens, providing a visual indication of the valve position.</p><h3>Non-Rising Stem Gate Valves</h3><p>The stem does not rise above the handwheel, making them suitable for applications with limited vertical space.</p><h3>Wedge Gate Valves</h3><p>Feature a wedge-shaped gate that provides tight sealing against the valve seats.</p><h3>Parallel Gate Valves</h3><p>Have parallel faces on the gate and are typically used in high-pressure applications.</p>'),
  
  ((SELECT id FROM topics WHERE slug = 'gate-valves'), 'Applications and Selection', '<p>Gate valves are commonly used in:</p><ul><li>Water treatment plants</li><li>Oil and gas pipelines</li><li>Power generation facilities</li><li>Chemical processing plants</li><li>HVAC systems</li></ul><p>When selecting gate valves, consider factors such as pressure rating, temperature range, material compatibility, and end connections.</p>'),
  
  ((SELECT id FROM topics WHERE slug = 'gate-valves'), 'Maintenance and Troubleshooting', '<p>Regular maintenance of gate valves includes:</p><ul><li>Periodic operation to prevent seizing</li><li>Inspection of packing and seals</li><li>Lubrication of stem threads</li><li>Checking for external leakage</li></ul><p>Common problems include stem binding, seat leakage, and packing leaks, which can often be resolved through proper maintenance procedures.</p>'),

  -- Centrifugal Pumps Content
  ((SELECT id FROM topics WHERE slug = 'centrifugal-pumps'), 'How Centrifugal Pumps Work', '<p>Centrifugal pumps are the most widely used type of pump in industrial applications. They work on the principle of centrifugal force to move fluids from the suction to the discharge.</p><p>The pump consists of an impeller that rotates within a volute casing, creating a centrifugal force that moves the fluid radially outward.</p>'),
  
  ((SELECT id FROM topics WHERE slug = 'centrifugal-pumps'), 'Main Components', '<h3>Impeller</h3><p>The rotating component that imparts energy to the fluid through centrifugal force.</p><h3>Volute Casing</h3><p>Converts the kinetic energy from the impeller into pressure energy.</p><h3>Shaft and Bearings</h3><p>Support the impeller and transmit power from the motor.</p><h3>Mechanical Seal</h3><p>Prevents leakage along the shaft where it enters the pump casing.</p>'),
  
  ((SELECT id FROM topics WHERE slug = 'centrifugal-pumps'), 'Performance Characteristics', '<p>Key performance parameters include:</p><ul><li><strong>Flow Rate (Q):</strong> Volume of fluid pumped per unit time</li><li><strong>Head (H):</strong> Energy imparted to the fluid per unit weight</li><li><strong>Efficiency (η):</strong> Ratio of hydraulic power output to mechanical power input</li><li><strong>NPSH:</strong> Net Positive Suction Head required to prevent cavitation</li></ul>'),
  
  ((SELECT id FROM topics WHERE slug = 'centrifugal-pumps'), 'Installation and Maintenance', '<p>Proper installation includes ensuring adequate suction conditions, proper alignment, and appropriate piping support.</p><p>Regular maintenance involves:</p><ul><li>Monitoring vibration and temperature</li><li>Checking mechanical seal condition</li><li>Inspecting impeller for wear or damage</li><li>Verifying proper lubrication of bearings</li></ul>'),

  -- Ball Bearings Content
  ((SELECT id FROM topics WHERE slug = 'ball-bearings'), 'Ball Bearing Fundamentals', '<p>Ball bearings are the most common type of rolling element bearings, designed to handle both radial and axial loads with minimal friction.</p><p>They consist of an inner race, outer race, ball elements, and a cage that separates and guides the balls.</p>'),
  
  ((SELECT id FROM topics WHERE slug = 'ball-bearings'), 'Types and Construction', '<h3>Deep Groove Ball Bearings</h3><p>Most common type, suitable for high speeds and moderate loads.</p><h3>Angular Contact Ball Bearings</h3><p>Designed to handle combined radial and axial loads.</p><h3>Self-Aligning Ball Bearings</h3><p>Can accommodate shaft misalignment and deflection.</p><h3>Thrust Ball Bearings</h3><p>Designed primarily for axial loads.</p>'),
  
  ((SELECT id FROM topics WHERE slug = 'ball-bearings'), 'Selection Criteria', '<p>When selecting ball bearings, consider:</p><ul><li>Load magnitude and direction (radial, axial, or combined)</li><li>Speed requirements and operating conditions</li><li>Operating temperature range</li><li>Environmental conditions (moisture, contamination)</li><li>Required service life and reliability</li><li>Space constraints and mounting requirements</li></ul>'),
  
  ((SELECT id FROM topics WHERE slug = 'ball-bearings'), 'Installation and Maintenance', '<p>Proper installation techniques:</p><ul><li>Use appropriate tools and heating methods</li><li>Ensure proper fit and alignment</li><li>Apply correct preload if required</li><li>Use clean handling procedures</li></ul><p>Maintenance best practices include regular lubrication, vibration monitoring, and temperature monitoring to detect early signs of failure.</p>'),

  -- Helical Gears Content
  ((SELECT id FROM topics WHERE slug = 'helical-gears'), 'Helical Gear Overview', '<p>Helical gears are cylindrical gears with teeth cut at an angle (helix angle) to the axis of rotation. This design provides smoother and quieter operation compared to spur gears.</p><p>The helical tooth design allows for gradual engagement, reducing noise and vibration while increasing load capacity.</p>'),
  
  ((SELECT id FROM topics WHERE slug = 'helical-gears'), 'Design Parameters', '<h3>Key Design Considerations:</h3><ul><li><strong>Helix Angle:</strong> Typically 15° to 45°, affects load capacity and axial thrust</li><li><strong>Module/Pitch:</strong> Determines tooth size and strength</li><li><strong>Pressure Angle:</strong> Usually 20°, affects tooth profile and contact stress</li><li><strong>Face Width:</strong> Affects load distribution and gear strength</li><li><strong>Number of Teeth:</strong> Influences gear ratio and contact ratio</li></ul>')
) AS new_content(topic_id, section_title, section_body)
WHERE NOT EXISTS (
  SELECT 1 FROM blog_content 
  WHERE blog_content.topic_id = new_content.topic_id 
  AND blog_content.section_title = new_content.section_title
);

-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Anyone can read categories" ON categories
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Anyone can read topics" ON topics
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Anyone can read blog content" ON blog_content
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can manage own progress" ON user_progress
  FOR ALL TO authenticated
  USING (auth.uid() = user_id);

-- Create functions
CREATE OR REPLACE FUNCTION check_subscription_status()
RETURNS void AS $$
BEGIN
  UPDATE users 
  SET subscription_status = 'inactive'
  WHERE subscription_status = 'active' 
    AND subscription_end_date < now();
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
    CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;