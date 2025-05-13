// set-admin-role.js

import { createClient } from '@supabase/supabase-js'
import 'dotenv/config' // Loads .env.local or .env automatically

const SUPABASE_URL = "https://sxmwznuprblypbfbstpa.supabase.co"
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4bXd6bnVwcmJseXBiZmJzdHBhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Njg4ODAxNywiZXhwIjoyMDYyNDY0MDE3fQ.XS6nM3q0T1C719Git5jNsJo93OBSu5driDBmVLew34Q"
const ADMIN_EMAIL = 'admin@em38.com'

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_URL or SERVICE_ROLE_KEY in environment variables')
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

async function setAdminRole(email) {
  // Get the user by email
  const { data: { users }, error } = await supabase.auth.admin.listUsers()
  if (error) throw error

  const user = users.find(u => u.email === email)
  if (!user) throw new Error('User not found')

  // Update app_metadata
  const { data, error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
    app_metadata: {
      ...user.app_metadata,
      role: 'admin'
    }
  })
  if (updateError) throw updateError

  console.log('Updated user:', data)
}

setAdminRole(ADMIN_EMAIL)
  .then(() => console.log('Done!'))
  .catch(err => console.error('Error:', err))