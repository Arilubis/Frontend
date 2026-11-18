<template>
  <div class="role-permissions-section">
    <h2>Role & Permissions</h2>
    <div class="bg-white p-7 rounded-2xl shadow-sm border border-gray-100 mt-4">
        <table>
            <thead>
                <tr>
                    <th>Role</th>
                    <th>Permissions</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>administrator</td>
                    <td>(Create, edit, delete)</td>
                    <td><button class="action-btn">⚙️</button></td>
                </tr>
                <tr>
                    <td>User</td>
                    <td>View only, read only, accepted, rejected</td>
                    <td><button class="action-btn">⚙️</button></td>
                </tr>
            </tbody>
        </table>
    </div>
  </div>
</template>

<script setup>
// Logika untuk fetch data roles
</script>

<style scoped>
/* ... styling table ... */
</style>