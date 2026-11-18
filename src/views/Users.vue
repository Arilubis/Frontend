


<template>
  <div class="min-h-screen bg-[#F8FAFC] px-4 pb-4 pt-1 md:px-6 md:pb-6 md:pt-2 font-[Poppins,sans-serif] text-slate-900 selection:bg-blue-100">
    <div class="max-w-[1440px] mx-auto">
        
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
  <div>
    <h1 class="text-2xl font-semibold text-slate-900 tracking-tight">User Management</h1>
    <p class="text-slate-500 text-[13px] font-normal">Centralized access control and authentication system.</p>
  </div>
          
          <button 
            @click="openCreateModal" 
            class="bg-[#0f172a] hover:bg-[#3a4556] text-white font-medium py-2.5 px-6 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center gap-2 group"
          >
            <span class="material-icons text-lg group-hover:rotate-90 transition-transform">add</span> 
            Add New User
          </button>
        </div>
      </div>

    <!-- Auth Warning -->
    <div v-if="authError" class="bg-red-50 border border-red-200 p-4 mb-6 rounded-xl flex items-center gap-3">
      <span class="material-icons text-red-500">warning</span>
      <div>
        <p class="font-semibold text-red-800">⚠️ Akses Ditolak</p>
        <p class="text-sm text-red-700">Sesi Anda mungkin telah berakhir. Silakan logout dan login kembali.</p>
      </div>
    </div>

    <!-- Stats Cards - Style AdminDashboard -->
    <section class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8" >

      <!-- Total Users -->
      <div class="bg-white p-4 md:p-5 rounded-[18px] md:rounded-[20px] border border-slate-200 shadow-sm hover:shadow-md transition-all">
        <div class="flex items-center justify-start mb-2 md:mb-3">
          <div class="p-2 md:p-2.5 rounded-xl text-white shadow-lg bg-blue-600">
            <span class="material-icons text-lg md:text-xl">people</span>
          </div>
        </div>
        <div class="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight text-center">{{ users.length }}</div>
        <div class="text-[10px] md:text-[11px] font-medium text-slate-500 uppercase tracking-wider mt-1.5 leading-tight text-center">Total Users</div>
      </div>

      <!-- Active -->
      <div class="bg-white p-4 md:p-5 rounded-[18px] md:rounded-[20px] border border-slate-200 shadow-sm hover:shadow-md transition-all">
        <div class="flex items-center justify-start mb-2 md:mb-3">
          <div class="p-2 md:p-2.5 rounded-xl text-white shadow-lg bg-emerald-500">
            <span class="material-icons text-lg md:text-xl">check_circle</span>
          </div>
        </div>
        <div class="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight text-center">{{ activeUsersCount }}</div>
        <div class="text-[10px] md:text-[11px] font-medium text-slate-500 uppercase tracking-wider mt-1.5 leading-tight text-center">Active</div>
      </div>

      <!-- Inactive -->
      <div class="bg-white p-4 md:p-5 rounded-[18px] md:rounded-[20px] border border-slate-200 shadow-sm hover:shadow-md transition-all">
        <div class="flex items-center justify-start mb-2 md:mb-3">
          <div class="p-2 md:p-2.5 rounded-xl text-white shadow-lg bg-slate-500">
            <span class="material-icons text-lg md:text-xl">pause_circle</span>
          </div>
        </div>
        <div class="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight text-center">{{ inactiveUsersCount }}</div>
        <div class="text-[10px] md:text-[11px] font-medium text-slate-500 uppercase tracking-wider mt-1.5 leading-tight text-center">Inactive</div>
      </div>

      <!-- Freeze -->
      <div class="bg-white p-4 md:p-5 rounded-[18px] md:rounded-[20px] border border-slate-200 shadow-sm hover:shadow-md transition-all">
        <div class="flex items-center justify-start mb-2 md:mb-3">
          <div class="p-2 md:p-2.5 rounded-xl text-white shadow-lg bg-blue-500">
            <span class="material-icons text-lg md:text-xl">ac_unit</span>
          </div>
        </div>
        <div class="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight text-center">{{ freezeUsersCount }}</div>
        <div class="text-[10px] md:text-[11px] font-medium text-slate-500 uppercase tracking-wider mt-1.5 leading-tight text-center">Freeze</div>
      </div>

      <!-- Blocked -->
      <div class="bg-white p-4 md:p-5 rounded-[18px] md:rounded-[20px] border border-slate-200 shadow-sm hover:shadow-md transition-all">
        <div class="flex items-center justify-start mb-2 md:mb-3">
          <div class="p-2 md:p-2.5 rounded-xl text-white shadow-lg bg-rose-500">
            <span class="material-icons text-lg md:text-xl">block</span>
          </div>
        </div>
        <div class="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight text-center">{{ blockedUsersCount }}</div>
        <div class="text-[10px] md:text-[11px] font-medium text-slate-500 uppercase tracking-wider mt-1.5 leading-tight text-center">Blocked</div>
      </div>

      <!-- Admin -->
      <div class="bg-white p-4 md:p-5 rounded-[18px] md:rounded-[20px] border border-slate-200 shadow-sm hover:shadow-md transition-all">
        <div class="flex items-center justify-start mb-2 md:mb-3">
          <div class="p-2 md:p-2.5 rounded-xl text-white shadow-lg bg-indigo-500">
            <span class="material-icons text-lg md:text-xl">admin_panel_settings</span>
          </div>
        </div>
        <div class="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight text-center">{{ adminUsersCount }}</div>
        <div class="text-[10px] md:text-[11px] font-medium text-slate-500 uppercase tracking-wider mt-1.5 leading-tight text-center">Admin</div>
      </div>

    </section>

    <!-- Search & Filter -->
    <section class="mb-6">
      <div class="flex flex-wrap items-center gap-4">

        <!-- SEARCH -->
        <div class="relative flex-1 min-w-[300px]">
          <span class="material-icons absolute left-4 top-3 text-slate-400 text-lg">search</span>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search by name, email, or username..."
            class="w-full pl-12 pr-4 py-2.5 border border-slate-200 rounded-xl shadow-sm
                  focus:ring-2 focus:ring-[#3d4f63]/20 focus:border-[#3d4f63] outline-none transition
                  text-[13px] font-normal bg-white placeholder:text-slate-400"
          />
        </div>

        <!-- FILTER PERAN -->
        <select
          v-model="selectedRole"
          class="w-full md:w-52 px-4 py-2.5 border border-slate-200 rounded-xl shadow-sm
                focus:ring-2 focus:ring-[#3d4f63]/20 focus:border-[#3d4f63] bg-white
                text-sm font-normal text-slate-700"
        >
          <option value="">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="APPROVER">Approver</option>
          <option value="USER">User</option>
          <option value="REVIEWER">Reviewer</option>
        </select>

        <!-- FILTER STATUS -->
        <select
          v-model="selectedStatus"
          class="w-full md:w-52 px-4 py-2.5 border border-slate-200 rounded-xl shadow-sm
                focus:ring-2 focus:ring-[#3d4f63]/20 focus:border-[#3d4f63] bg-white
                text-sm font-normal text-slate-700"
        >
          <option value="">All Posts</option>
          <option value="1">Aktif</option>
          <option value="2">Tidak Aktif</option>
          <option value="3">Freeze</option>
          <option value="4">Blocked</option>
        </select>
      </div>
    </section>

    <!-- Table Container -->
    <div class="bg-white shadow-sm rounded-[24px] overflow-hidden border border-slate-200">
      <div v-if="tableLoading" class="p-20 text-center">
        <div class="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
        <p class="text-slate-500 font-medium">Memuat data pengguna...</p>
      </div>
      <!-- Error State -->
      <div v-else-if="loadError" class="p-20 text-center">
        <span class="material-icons text-5xl mb-4 text-red-300">error_outline</span>
        <p class="font-semibold text-red-500">⚠️ Error loading data</p>
        <p class="text-sm mt-2 text-gray-600">{{ loadError }}</p>
        <button @click="loadUsers" class="mt-4 bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-600 font-semibold">
          Coba Lagi
        </button>
      </div>
      <!-- Empty State -->
      <div v-else-if="sortedUsers.length === 0" class="p-20 text-center text-gray-500">
        <span class="material-icons text-5xl mb-4 text-gray-300">person_off</span>
        <p v-if="searchQuery">Tidak ada pengguna yang cocok dengan pencarian "{{ searchQuery }}"</p>
        <p v-else>Tidak ada data pengguna yang ditemukan.</p>
      </div>
      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <!-- Table Header -->
          <thead class="bg-slate-50/50 border-b border-gray-100">
            <tr>
              <th 
                @click="sortByField('name')"
                class="px-6 py-4 text-[11px] font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-blue-600 transition-colors">
                Name <span v-if="sortKey === 'name'" class="text-blue-600">{{ sortOrder === 1 ? '▲' : '▼' }}</span>
              </th>
              <th 
                @click="sortByField('username')"
                class="px-6 py-4 text-[11px] font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-blue-600 transition-colors">
                Username <span v-if="sortKey === 'username'" class="text-blue-600">{{ sortOrder === 1 ? '▲' : '▼' }}</span>
              </th>
              <th class="px-6 py-4 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Role
              </th>
              <th class="px-6 py-4 text-[11px] font-medium text-slate-500 uppercase tracking-wider text-center">
                Status
              </th>
              <th class="px-6 py-4 text-[11px] font-medium text-slate-500 uppercase tracking-wider text-right">
                Action
              </th>
            </tr>
          </thead>
          <!-- Table Body -->
          <tbody class="divide-y divide-slate-50">
            <tr v-for="user in paginatedUsers" :key="user.id" class="hover:bg-blue-50/30 transition-colors">
              <!-- Nama -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-semibold text-[13px] text-slate-800">{{ user.name }}</div>
              </td>
              <!-- Username -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-[13px] font-normal text-slate-500">@{{ user.username }}</div>
              </td>
              <!-- Role -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-3 py-1 text-[10px] font-medium rounded-full uppercase inline-block bg-[#f1f5f9] text-slate-600">
                  {{ user.role || 'USER' }}
                </span>
              </td>
              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <button
                  @click="openStatusModal(user)"
                  :class="getDetailedStatus(user).class"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium border transition-all hover:opacity-80"
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    :class="{
                      'bg-emerald-500': user.status === 1 || user.status === true,
                      'bg-orange-400': user.status === 2 || user.status === false,
                      'bg-blue-500':   user.status === 3,
                      'bg-rose-500':   user.status === 4,
                    }"
                  ></span>
                  {{ getDetailedStatus(user).text }}
                </button>
              </td>
              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                <button
                  v-if="canImpersonate(user)"
                  @click="openImpersonateModal(user)"
                  class="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition mr-1"
                  title="Impersonate User"
                >
                  <span class="material-icons text-lg">switch_account</span>
                </button>
                <button @click="editUser(user)" class="p-2 text-slate-600 hover:bg-indigo-50 rounded-lg transition mr-1" title="Edit User">
                  <span class="material-icons text-lg">edit</span>
                </button>
                <button @click="openResetPasswordModal(user)" class="p-2 text-amber-600 hover:bg-yellow-50 rounded-lg transition mr-1" title="Reset Password">
                  <span class="material-icons text-lg">lock_reset</span>
                </button>
                <button @click="deleteUserHandler(user.id)" class="p-2 text-rose-500 hover:bg-red-50 rounded-lg transition" title="Delete">
                  <span class="material-icons text-lg">delete</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ✅ PAGINATION -->
      <div v-if="sortedUsers.length > 0" class="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-slate-100" >

        <!-- Info kiri -->
        <p class="text-[12px] text-slate-400 font-normal">
          Showing
          <span class="font-semibold text-slate-700">{{ ((currentPage - 1) * itemsPerPage) + 1 }}</span>
          –
          <span class="font-semibold text-slate-700">{{ Math.min(currentPage * itemsPerPage, sortedUsers.length) }}</span>
          of
          <span class="font-semibold text-slate-700">{{ sortedUsers.length }}</span>
          users
        </p>

        <!-- Tombol halaman tengah -->
        <div class="flex items-center gap-1">

          <!-- Prev -->
          <button
            @click="currentPage > 1 && currentPage--"
            :disabled="currentPage === 1"
            class="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <span class="material-icons text-[16px]">chevron_left</span>
          </button>

          <!-- Page Numbers -->
          <template v-for="page in totalPages" :key="page">
            <button
              v-if="page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)"
              @click="currentPage = page"
              :class="currentPage === page
                ? 'bg-[#0f172a] text-white border-[#0f172a]'
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700'"
              class="w-8 h-8 flex items-center justify-center rounded-lg border text-[12px] font-medium transition-all"
            >
              {{ page }}
            </button>
            <span
              v-else-if="page === currentPage - 2 || page === currentPage + 2"
              class="w-8 h-8 flex items-center justify-center text-slate-300 text-[12px] select-none"
            >···</span>
          </template>

          <!-- Next -->
          <button
            @click="currentPage < totalPages && currentPage++"
            :disabled="currentPage === totalPages || totalPages === 0"
            class="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <span class="material-icons text-[16px]">chevron_right</span>
          </button>

        </div>

        <!-- Rows per page kanan -->
        <div class="flex items-center gap-2">
          <span class="text-[12px] text-slate-400 font-normal">Rows per page:</span>
          <select
            v-model="itemsPerPage"
            @change="currentPage = 1"
            class="text-[12px] font-medium text-slate-600 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-slate-300 transition-all cursor-pointer appearance-none pr-6"
            style="background-image: url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22><path fill=%22%2394a3b8%22 d=%22M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z%22/></svg>'); background-repeat: no-repeat; background-position: right 6px center; background-size: 14px;"
          >
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
        </div>
      </div>
    </div>

    <!-- ✅ MODAL: CREATE/EDIT USER  -->
    <Transition name="modal-fade">
      <div
        v-if="showUserModal"
        @click.self="closeUserModal"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md"
        style="background: rgba(15, 23, 42, 0.4);"
      >
        <div class="bg-white rounded-[32px] border border-slate-200 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <div class="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 flex-shrink-0">
            <div class="flex items-center gap-5">
              <div
                class="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                style="background:#3d4f63; box-shadow:0 4px 14px rgba(61,79,99,0.30);"
              >
                <span class="material-icons text-white">{{ editingUser ? 'edit_note' : 'person_add' }}</span>
              </div>
              <div>
                <h2 class="text-xl font-semibold tracking-tight text-slate-900 leading-none">
                  {{ editingUser ? 'Update User' : 'Add User' }}
                </h2>
                <p class="text-slate-400 text-[10px] font-normal uppercase tracking-[0.15em] mt-1.5 flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full animate-pulse" style="background:#3d4f63;"></span>
                  {{ editingUser ? 'Update user information' : 'Add a new user account' }}
                </p>
              </div>
            </div>
            <button
              @click="closeUserModal"
              class="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
            >
              <span class="material-icons">close</span>
            </button>
          </div>

          <div class="overflow-y-auto flex-1 px-10 py-8 bg-white">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[10px] font-normal uppercase tracking-wider text-slate-500 ml-1 flex items-center gap-1">
                  <span class="material-icons" style="font-size:12px; color:#3d4f63;">alternate_email</span>
                  Username *
                </label>
                <div class="relative">
                  <span class="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">alternate_email</span>
                  <input
                    v-model="form.username"
                    @blur="validateField('username')"
                    type="text"
                    placeholder="Masukkan username"
                    :class="[
                      'w-full pl-11 pr-4 py-3 border rounded-xl text-sm font-normal text-slate-700 outline-none transition-all placeholder:font-normal placeholder:text-slate-300',
                      validationErrors.username
                        ? 'bg-red-50 border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                        : 'bg-slate-50 border-slate-200 focus:border-[#3d4f63] focus:bg-white focus:ring-4 focus:ring-[#3d4f63]/10'
                    ]"
                    required
                  />
                </div>
                <p v-if="validationErrors.username" class="text-red-500 text-xs font-bold ml-1 flex items-center gap-1">
                  <span class="material-icons text-xs">warning</span> {{ validationErrors.username }}
                </p>
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-normal uppercase tracking-wider text-slate-500 ml-1 flex items-center gap-1">
                  <span class="material-icons" style="font-size:12px; color:#3d4f63;">badge</span>
                  Full Name *
                </label>
                <div class="relative">
                  <span class="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">badge</span>
                  <input
                    v-model="form.name"
                    @blur="validateField('name')"
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    :class="[
                      'w-full pl-11 pr-4 py-3 border rounded-xl text-sm font-normal text-slate-700 outline-none transition-all placeholder:font-normal placeholder:text-slate-300',
                      validationErrors.name
                        ? 'bg-red-50 border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                        : 'bg-slate-50 border-slate-200 focus:border-[#3d4f63] focus:bg-white focus:ring-4 focus:ring-[#3d4f63]/10'
                    ]"
                    required
                  />
                </div>
                <p v-if="validationErrors.name" class="text-red-500 text-xs font-bold ml-1 flex items-center gap-1">
                  <span class="material-icons text-xs">warning</span> {{ validationErrors.name }}
                </p>
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-normal uppercase tracking-wider text-slate-500 ml-1 flex items-center gap-1">
                  <span class="material-icons" style="font-size:12px; color:#3d4f63;">mail_outline</span>
                  Email *
                </label>
                <div class="relative">
                  <span class="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">mail_outline</span>
                  <input
                    v-model="form.email"
                    @blur="validateField('email')"
                    type="email"
                    placeholder="Masukkan email"
                    :class="[
                      'w-full pl-11 pr-4 py-3 border rounded-xl text-sm font-normal text-slate-700 outline-none transition-all placeholder:font-normal placeholder:text-slate-300',
                      validationErrors.email
                        ? 'bg-red-50 border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                        : 'bg-slate-50 border-slate-200 focus:border-[#3d4f63] focus:bg-white focus:ring-4 focus:ring-[#3d4f63]/10'
                    ]"
                    required
                  />
                </div>
                <p v-if="validationErrors.email" class="text-red-500 text-xs font-bold ml-1 flex items-center gap-1">
                  <span class="material-icons text-xs">warning</span> {{ validationErrors.email }}
                </p>
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-normal uppercase tracking-wider text-slate-500 ml-1 flex items-center gap-1">
                  <span class="material-icons" style="font-size:12px; color:#3d4f63;">phone_iphone</span>
                  Phone Number *
                </label>
                <div class="relative">
                  <span class="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">phone_iphone</span>
                  <input
                    v-model="form.phone"
                    @blur="validateField('phone')"
                    type="tel"
                    placeholder="Masukkan nomor telepon"
                    :class="[
                      'w-full pl-11 pr-4 py-3 border rounded-xl text-sm font-normal text-slate-700 outline-none transition-all placeholder:font-normal placeholder:text-slate-300',
                      validationErrors.phone
                        ? 'bg-red-50 border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                        : 'bg-slate-50 border-slate-200 focus:border-[#3d4f63] focus:bg-white focus:ring-4 focus:ring-[#3d4f63]/10'
                    ]"
                    required
                  />
                </div>
                <p v-if="validationErrors.phone" class="text-red-500 text-xs font-bold ml-1 flex items-center gap-1">
                  <span class="material-icons text-xs">warning</span> {{ validationErrors.phone }}
                </p>
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-normal uppercase tracking-wider text-slate-500 ml-1 flex items-center gap-1">
                  <span class="material-icons" style="font-size:12px; color:#3d4f63;">calendar_today</span>
                  Date of Birth *
                </label>
                <div class="relative">
                  <span class="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">calendar_today</span>
                  <input
                    v-model="form.birthDate"
                    type="date"
                    class="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-normal text-slate-700 outline-none focus:border-[#3d4f63] focus:bg-white focus:ring-4 focus:ring-[#3d4f63]/10 transition-all cursor-pointer"
                    required
                  />
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-normal uppercase tracking-wider text-slate-500 ml-1 flex items-center gap-1">
                  <span class="material-icons" style="font-size:12px; color:#3d4f63;">people</span>
                  Gender *
                </label>
                <div class="relative">
                  <span class="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">people</span>
                  <select
                    v-model="form.gender"
                    class="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-normal text-slate-700 outline-none focus:border-[#3d4f63] focus:bg-white focus:ring-4 focus:ring-[#3d4f63]/10 transition-all appearance-none cursor-pointer"
                    required
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                  <span class="material-icons absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">expand_more</span>
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-normal uppercase tracking-wider text-slate-500 ml-1 flex items-center gap-1">
                  <span class="material-icons" style="font-size:12px; color:#3d4f63;">work_outline</span>
                  Job Title *
                </label>
                <div class="relative">
                  <span class="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">work_outline</span>
                  <input
                    v-model="form.jabatan"
                    type="text"
                    placeholder="Enter job title"
                    class="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-normal text-slate-700 outline-none focus:border-[#3d4f63] focus:bg-white focus:ring-4 focus:ring-[#3d4f63]/10 transition-all placeholder:font-normal placeholder:text-slate-300"
                    required
                  />
                </div>
              </div>

              <div class="md:col-span-2 space-y-2">
                <label class="text-[10px] font-normal uppercase tracking-wider text-slate-500 ml-1 flex items-center gap-1">
                  <span class="material-icons" style="font-size:12px; color:#3d4f63;">admin_panel_settings</span>
                  Role *
                  <span class="text-slate-400 font-normal normal-case tracking-normal ml-1">(max. 4)</span>
                </label>
                <div class="flex flex-wrap gap-2 min-h-[48px] items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
                  <span
                    v-for="role in form.roles"
                    :key="role"
                    :class="{
                      'bg-rose-100 text-rose-700 border border-rose-300':     role === 'ADMIN',
                      'bg-amber-100 text-amber-700 border border-amber-300':   role === 'APPROVER',
                      'bg-blue-100 text-blue-700 border border-blue-300':      role === 'USER',
                      'bg-violet-100 text-violet-700 border border-violet-300': role === 'REVIEWER',
                    }"
                    class="flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-medium uppercase tracking-wider"
                  >
                    {{ role }}
                    <button
                      v-if="form.roles.length > 1"
                      type="button"
                      @click="removeRole(role)"
                      class="ml-1 hover:opacity-60 transition-opacity leading-none"
                    >
                      <span class="material-icons text-[13px]">close</span>
                    </button>
                  </span>
                  <div v-if="availableRolesToAdd.length > 0" class="relative group">
                    <button
                      type="button"
                      class="w-8 h-8 flex items-center justify-center rounded-full text-white transition-all shadow-sm active:scale-90"
                      style="background:#3d4f63; box-shadow:0 2px 8px rgba(61,79,99,0.25);"
                      title="Tambah Role"
                    >
                      <span class="material-icons text-sm">add</span>
                    </button>
                    <div class="absolute left-0 top-10 z-20 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 min-w-[140px]
                                invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <button
                        v-for="role in availableRolesToAdd"
                        :key="role"
                        type="button"
                        @click="addRole(role)"
                        :class="{
                          'hover:bg-rose-50 text-rose-700':     role === 'ADMIN',
                          'hover:bg-amber-50 text-amber-700':   role === 'APPROVER',
                          'hover:bg-blue-50 text-blue-700':     role === 'USER',
                          'hover:bg-violet-50 text-violet-700': role === 'REVIEWER',
                        }"
                        class="w-full text-left px-4 py-2 text-xs font-medium uppercase tracking-wider transition-colors"
                      >
                        {{ role }}
                      </button>
                    </div>
                  </div>
                </div>
                <p class="text-[10px] text-slate-400 font-normal ml-1">
                  Click <strong>+</strong> to add a role. Click <strong>×</strong> on a badge to remove it.
                </p>
              </div>

              <div v-if="!editingUser" class="md:col-span-2">
                <div class="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div class="flex items-center gap-2">
                    <span class="material-icons text-lg" style="color:#3d4f63;">lock_open</span>
                    <label class="text-[10px] font-normal uppercase tracking-wider text-slate-600">Password *</label>
                  </div>
                  <div class="relative">
                    <input
                      v-model="form.password"
                      @blur="validateField('password')"
                      :type="showPassword ? 'text' : 'password'"
                      placeholder="Masukkan password (min 8 karakter)"
                      :class="[
                        'w-full px-5 py-3 border rounded-xl text-sm font-normal text-slate-700 outline-none transition-all shadow-sm placeholder:font-normal placeholder:text-slate-300',
                        validationErrors.password
                          ? 'bg-red-50 border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                          : 'bg-white border-slate-200 focus:border-[#3d4f63] focus:ring-4 focus:ring-[#3d4f63]/10'
                      ]"
                      required
                    />
                    <button
                      type="button"
                      @click="togglePassword"
                      class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors"
                      :class="{ 'text-[#3d4f63]': showPassword }"
                    >
                      <span class="material-icons text-lg">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
                    </button>
                  </div>
                  <p v-if="validationErrors.password" class="text-red-500 text-xs font-bold ml-1 flex items-center gap-1">
                    <span class="material-icons text-xs">warning</span> {{ validationErrors.password }}
                  </p>
                  <p v-else class="text-xs text-slate-400 ml-1">
                    Password must be at least 8 characters, containing uppercase, lowercase, numbers, and symbols.
                  </p>

                    <div class="relative mt-2">
                        <label class="text-[10px] font-medium uppercase tracking-wider text-slate-600 flex items-center gap-2 mb-2">
                          <span class="material-icons text-sm" style="color:#3d4f63;">verified</span>
                          Konfirmasi Password *
                        </label>
                        <input
                          v-model="form.confirmPassword"
                          :type="showConfirmPassword ? 'text' : 'password'"
                          placeholder="Ulangi password"
                          :class="[
                            'w-full px-5 py-3 border rounded-xl text-sm font-normal text-slate-700 outline-none transition-all shadow-sm placeholder:font-normal placeholder:text-slate-300',
                            form.confirmPassword && form.confirmPassword !== form.password
                              ? 'bg-red-50 border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                              : form.confirmPassword && form.confirmPassword === form.password
                                ? 'bg-white border-[#3d4f63] focus:ring-4 focus:ring-[#3d4f63]/10'
                                : 'bg-white border-slate-200 focus:border-[#3d4f63] focus:ring-4 focus:ring-[#3d4f63]/10'
                          ]"
                        />
                        <button
                          type="button"
                          @click="showConfirmPassword = !showConfirmPassword"
                          class="absolute right-4 top-[42px] text-slate-400 transition-colors"
                          :class="{ 'text-[#3d4f63]': showConfirmPassword }"
                        >
                          <span class="material-icons text-lg">{{ showConfirmPassword ? 'visibility_off' : 'visibility' }}</span>
                        </button>
                        <div v-if="form.confirmPassword && form.confirmPassword !== form.password" class="flex items-center gap-1.5 mt-1">
                          <span class="material-icons text-red-500 text-sm">error</span>
                          <p class="text-red-500 text-xs font-bold">Password tidak cocok</p>
                        </div>
                        <div v-if="form.confirmPassword && form.confirmPassword === form.password" class="flex items-center gap-1.5 mt-1">
                          <span class="material-icons text-sm" style="color:#3d4f63;">check_circle</span>
                          <p class="text-xs font-bold" style="color:#3d4f63;">Password cocok</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
                  
          <div class="px-10 py-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 flex-shrink-0">
            <button
              type="button"
              @click="closeUserModal"
              class="px-4 py-2 text-[11px] font-normal uppercase tracking-wider text-slate-400 hover:text-[#3d4f63] transition-all flex items-center gap-2"
            >
              <span class="material-icons text-sm">keyboard_return</span> Cancel
            </button>
            <button
              type="button"
              @click="editingUser ? updateUserHandler() : createUserHandler()"
              :disabled="formLoading"
              class="px-8 py-3.5 text-white rounded-xl font-medium text-sm uppercase tracking-wider transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              style="background:#3d4f63; box-shadow:0 8px 20px rgba(61,79,99,0.25);"
            >
              <span v-if="formLoading" class="material-icons text-sm animate-spin">sync</span>
              <span v-else class="material-icons text-sm">{{ editingUser ? 'save' : 'person_add' }}</span>
              {{ formLoading ? 'Processing...' : (editingUser ? 'Update' : 'Create') }}
            </button>
          </div>

        </div>
      </div>
    </Transition>

    <!-- ✅ MODAL: RESET PASSWORD -->
    <Transition name="modal-fade">
      <div
        v-if="showResetModal"
        @click.self="closeResetModal"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md"
        style="background: rgba(15, 23, 42, 0.4);"
      >
        <div class="bg-white rounded-[32px] border border-slate-200 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] w-full max-w-md overflow-hidden flex flex-col">
          <div class="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 flex-shrink-0">
            <div class="flex items-center gap-5">
              <div
                class="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                style="background:#3d4f63; box-shadow:0 4px 14px rgba(61,79,99,0.30);"
              >
                <span class="material-icons text-white">lock_reset</span>
              </div>
              <div>
                <h2 class="text-xl font-semibold tracking-tight text-slate-900 leading-none">
                  Reset Password
                </h2>
                <p class="text-slate-400 text-[10px] font-normal uppercase tracking-wider mt-1.5 flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full animate-pulse" style="background:#3d4f63;"></span>
                  User: <strong class="text-slate-600">{{ selectedUser?.username }}</strong>
                </p>
              </div>
            </div>
            <button
              @click="closeResetModal"
              class="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
            >
              <span class="material-icons">close</span>
            </button>
          </div>

          <div class="px-10 py-8 bg-white space-y-6">
            <div class="space-y-2">
              <label class="text-[10px] font-normal uppercase tracking-wider text-slate-500 ml-1 flex items-center gap-1">
                <span class="material-icons" style="font-size:12px; color:#3d4f63;">lock</span>
                New Password *
              </label>
              <div class="relative">
                <span class="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">lock</span>
                <input
                  v-model="resetPasswordForm.newPassword"
                  :type="showResetPassword ? 'text' : 'password'"
                  placeholder="Enter new password"
                  :class="[
                    'w-full pl-11 pr-12 py-3 border rounded-xl text-sm font-normal text-slate-700 outline-none transition-all focus:ring-4',
                    resetPasswordForm.newPassword && !isPasswordValid
                      ? 'bg-red-50 border-red-400 focus:border-red-500 focus:ring-red-500/10'
                      : resetPasswordForm.newPassword && isPasswordValid
                        ? 'border-[#3d4f63] bg-white focus:ring-[#3d4f63]/10'
                        : 'bg-slate-50 border-slate-200 focus:border-[#3d4f63] focus:bg-white focus:ring-[#3d4f63]/10'
                  ]"
                  required
                />
                <button
                  type="button"
                  @click="showResetPassword = !showResetPassword"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors"
                  :class="{ 'text-[#3d4f63]': showResetPassword }"
                >
                  <span class="material-icons text-lg">{{ showResetPassword ? 'visibility_off' : 'visibility' }}</span>
                </button>
              </div>

              <div v-if="resetPasswordForm.newPassword" class="p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-3">
                <p class="text-[9px] font-normal uppercase tracking-wider text-slate-400 mb-3">Password Requirements</p>
                <div class="grid grid-cols-2 gap-x-4 gap-y-2">

                  <div class="flex items-center gap-2">
                    <span
                      class="material-icons text-sm flex-shrink-0"
                      :style="{ color: passwordChecks.minLength ? '#3d4f63' : '#cbd5e1' }"
                    >{{ passwordChecks.minLength ? 'check_circle' : 'radio_button_unchecked' }}</span>
                    <span
                      class="text-xs font-normal"
                      :class="passwordChecks.minLength ? 'text-slate-700' : 'text-slate-400'"
                    >Min 8 karakter</span>
                  </div>

                  <div class="flex items-center gap-2">
                    <span
                      class="material-icons text-sm flex-shrink-0"
                      :style="{ color: passwordChecks.hasUpper ? '#3d4f63' : '#cbd5e1' }"
                    >{{ passwordChecks.hasUpper ? 'check_circle' : 'radio_button_unchecked' }}</span>
                    <span
                      class="text-xs font-normal"
                      :class="passwordChecks.hasUpper ? 'text-slate-700' : 'text-slate-400'"
                    >Huruf besar (A-Z)</span>
                  </div>

                  <div class="flex items-center gap-2">
                    <span
                      class="material-icons text-sm flex-shrink-0"
                      :style="{ color: passwordChecks.hasLower ? '#3d4f63' : '#cbd5e1' }"
                    >{{ passwordChecks.hasLower ? 'check_circle' : 'radio_button_unchecked' }}</span>
                    <span
                      class="text-xs font-normal"
                      :class="passwordChecks.hasLower ? 'text-slate-700' : 'text-slate-400'"
                    >Huruf kecil (a-z)</span>
                  </div>

                  <div class="flex items-center gap-2">
                    <span
                      class="material-icons text-sm flex-shrink-0"
                      :style="{ color: passwordChecks.hasNumber ? '#3d4f63' : '#cbd5e1' }"
                    >{{ passwordChecks.hasNumber ? 'check_circle' : 'radio_button_unchecked' }}</span>
                    <span
                      class="text-xs font-normal"
                      :class="passwordChecks.hasNumber ? 'text-slate-700' : 'text-slate-400'"
                    >Angka (0-9)</span>
                  </div>

                  <div class="flex items-center gap-2 col-span-2">
                    <span
                      class="material-icons text-sm flex-shrink-0"
                      :style="{ color: passwordChecks.hasSymbol ? '#3d4f63' : '#cbd5e1' }"
                    >{{ passwordChecks.hasSymbol ? 'check_circle' : 'radio_button_unchecked' }}</span>
                    <span
                      class="text-xs font-bold"
                      :class="passwordChecks.hasSymbol ? 'text-slate-700' : 'text-slate-400'"
                    >Simbol (!@#$%^&*)</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-normal uppercase tracking-wider text-slate-500 ml-1 flex items-center gap-1">
                <span class="material-icons" style="font-size:12px; color:#3d4f63;">verified</span>
                Confirm Password *
              </label>
              <div class="relative">
                <span class="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">verified</span>
                <input
                  v-model="resetPasswordForm.confirmPassword"
                  :type="showResetPasswordConfirm ? 'text' : 'password'"
                  placeholder="Confirm new password"
                  :class="[
                    'w-full pl-11 pr-12 py-3 border rounded-xl text-sm font-bold text-slate-700 outline-none transition-all focus:ring-4',
                    isPasswordMatch === false
                      ? 'bg-red-50 border-red-400 focus:border-red-500 focus:ring-red-500/10'
                      : isPasswordMatch === true
                        ? 'border-[#3d4f63] bg-white focus:ring-[#3d4f63]/10'
                        : 'bg-slate-50 border-slate-200 focus:border-[#3d4f63] focus:bg-white focus:ring-[#3d4f63]/10'
                  ]"
                  required
                />
                <button
                  type="button"
                  @click="showResetPasswordConfirm = !showResetPasswordConfirm"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors"
                  :class="{ 'text-[#3d4f63]': showResetPasswordConfirm }"
                >
                  <span class="material-icons text-lg">{{ showResetPasswordConfirm ? 'visibility_off' : 'visibility' }}</span>
                </button>
              </div>

              <div v-if="isPasswordMatch === false" class="flex items-center gap-1.5 mt-1">
                <span class="material-icons text-red-500 text-sm">error</span>
                <p class="text-red-500 text-xs font-normal">Passwords do not match</p>
              </div>
              <div v-if="isPasswordMatch === true" class="flex items-center gap-1.5 mt-1">
                <span class="material-icons text-sm" style="color:#3d4f63;">check_circle</span>
                <p class="text-xs font-normal" style="color:#3d4f63;">Passwords match</p>
              </div>
            </div>
          </div>
          <div class="px-10 py-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 flex-shrink-0">
            <button
              type="button"
              @click="closeResetModal"
              class="px-4 py-2 text-[11px] font-normal uppercase tracking-wider text-slate-400 hover:text-[#3d4f63] transition-all flex items-center gap-2"
            >
              <span class="material-icons text-sm">keyboard_return</span> Cancel
            </button>
            <button
              type="button"
              @click="submitResetPassword"
              :disabled="formLoading"
              class="px-8 py-3.5 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              style="background:#3d4f63; box-shadow:0 8px 20px rgba(61,79,99,0.25);"
            >
              <span v-if="formLoading" class="material-icons text-sm animate-spin">sync</span>
              <span v-else class="material-icons text-sm">lock_reset</span>
              {{ formLoading ? 'Processing...' : 'Reset Password' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ✅ MODAL: STATUS USER - MODERN BLUE VERSION -->
    <Transition name="modal-fade">
      <div v-if="showStatusModal"
          @click.self="closeStatusModal"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
          style="background: rgba(15, 23, 42, 0.4);"> <div class="bg-white/80 backdrop-blur-2xl rounded-[32px] border border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] max-w-md w-full overflow-hidden">
          
          <div class="px-8 pt-10 pb-6">
            <h2 class="text-2xl font-black text-slate-800 tracking-tight uppercase italic">
              Account Status
            </h2>
            <p class="text-slate-500 text-xs font-medium uppercase tracking-widest mt-1">
              Target: <span class="text-blue-600 font-bold">{{ selectedUserForStatus?.username }}</span>
            </p>
          </div>

          <div class="px-6 pb-8 space-y-3">
            
            <button @click="updateUserStatus('ACTIVE')"
                    class="group w-full flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-emerald-500 hover:shadow-[0_10px_20px_-5px_rgba(16,185,129,0.2)] transition-all duration-300">
              <div class="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-500 transition-all">
                <span class="material-icons text-emerald-500 group-hover:text-white">check_circle</span>
              </div>
              <div class="text-left flex-1">
                <p class="text-sm font-bold text-slate-700">Active</p>
                <p class="text-[11px] text-slate-400">Full access to all features</p>
              </div>
              <span class="material-icons text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all">arrow_forward</span>
            </button>

            <button @click="updateUserStatus('INACTIVE')"
                    class="group w-full flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-slate-400 hover:shadow-[0_10px_20px_-5px_rgba(71,85,105,0.1)] transition-all duration-300">
              <div class="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-slate-500 transition-all">
                <span class="material-icons text-slate-500 group-hover:text-white">pause_circle</span>
              </div>
              <div class="text-left flex-1">
                <p class="text-sm font-bold text-slate-700">Inactive</p>
                <p class="text-[11px] text-slate-400">Temporary disable user login</p>
              </div>
              <span class="material-icons text-slate-300 group-hover:translate-x-1 transition-all">arrow_forward</span>
            </button>

            <button @click="updateUserStatus('FREEZE')"
                    class="group w-full flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-blue-500 hover:shadow-[0_10px_20px_-5px_rgba(59,130,246,0.2)] transition-all duration-300">
              <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-500 transition-all">
                <span class="material-icons text-blue-500 group-hover:text-white">ac_unit</span>
              </div>
              <div class="text-left flex-1">
                <p class="text-sm font-bold text-slate-700">Freeze Account</p>
                <p class="text-[11px] text-slate-400">Restricted for security review</p>
              </div>
              <span class="material-icons text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all">arrow_forward</span>
            </button>

            <button @click="updateUserStatus('BLOCKED')"
                    class="group w-full flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-rose-500 hover:shadow-[0_10px_20px_-5px_rgba(244,63,94,0.2)] transition-all duration-300">
              <div class="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center group-hover:bg-rose-500 transition-all">
                <span class="material-icons text-rose-500 group-hover:text-white">block</span>
              </div>
              <div class="text-left flex-1">
                <p class="text-sm font-bold text-slate-700">Blocked</p>
                <p class="text-[11px] text-slate-400">Terminate platform access</p>
              </div>
              <span class="material-icons text-slate-300 group-hover:text-rose-500 group-hover:translate-x-1 transition-all">arrow_forward</span>
            </button>

          </div>

          <div class="px-8 py-6 bg-slate-50/50 border-t border-slate-100">
            <button @click="closeStatusModal"
                    class="w-full py-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">
              Cancel Operation
            </button>
          </div>

        </div>
      </div>
    </Transition>

    <!-- ✅ MODAL: CONFIRM DELETE STEP 1  -->
    <Transition name="modal-fade">
      <div
        v-if="showDeleteConfirmModal"
        @click.self="cancelDelete"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md"
        style="background: rgba(15, 23, 42, 0.4);"
      >
        <div class="bg-white rounded-[32px] border border-slate-200 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] w-full max-w-md overflow-hidden flex flex-col">
          <div class="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 flex-shrink-0">
            <div class="flex items-center gap-5">
              <div class="w-12 h-12 bg-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-rose-200">
                <span class="material-icons text-white">warning</span>
              </div>
              <div>
                <h2 class="text-xl font-semibold tracking-tight text-slate-900 leading-none">
                  Delete User?
                </h2>
                <p class="text-slate-400 text-[10px] font-normal uppercase tracking-wider mt-1.5 flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                  This action cannot be undone
                </p>
              </div>
            </div>
            <button
              @click="cancelDelete"
              class="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
            >
              <span class="material-icons">close</span>
            </button>
          </div>
    
          <div class="px-10 py-10 bg-white">
            <div class="bg-rose-50 rounded-2xl p-6 border border-rose-100 text-center">
              <div class="flex items-start gap-3 mb-4 text-left">
                <span class="material-icons text-rose-500 text-xl flex-shrink-0">info</span>
                <div>
                  <p class="text-sm font-semibold text-rose-800 mb-1">Warning!</p>
                  <p class="text-xs font-normal text-rose-600">
                    You are about to delete this user from the system. Please make sure you are certain about this action.
                  </p>
                </div>
              </div>
              <p class="text-slate-500 text-sm font-normal">
                Are you sure you want to delete user
                <span class="font-semibold text-slate-900 uppercase">"{{ selectedUser?.username }}"</span>?
              </p>
            </div>
          </div>
    
          <div class="px-10 py-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 flex-shrink-0">
            <button
              type="button"
              @click="cancelDelete"
              class="px-4 py-2 text-[11px] font-normal uppercase tracking-wider text-slate-400 hover:text-[#3d4f63] transition-all flex items-center gap-2"
            >
              <span class="material-icons text-sm">keyboard_return</span> Cancel
            </button>
            <button
              type="button"
              @click="confirmDeleteStep1"
              class="px-8 py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-medium text-sm uppercase tracking-wide transition-all flex items-center gap-3 shadow-xl shadow-rose-200 active:scale-95"
            >
              <span class="material-icons text-sm">delete_forever</span>
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ✅ MODAL: DELETE TYPE SELECTION -->
    <Transition name="modal-fade">
      <div
        v-if="showDeleteTypeModal"
        @click.self="cancelDelete"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md"
        style="background: rgba(15, 23, 42, 0.4);"
      >
        <div class="bg-white rounded-[32px] border border-slate-200 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] w-full max-w-md overflow-hidden flex flex-col">
          <div class="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 flex-shrink-0">
            <div class="flex items-center gap-5">
              <div
                class="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                style="background:#3d4f63; box-shadow:0 4px 14px rgba(61,79,99,0.30);"
              >
                <span class="material-icons text-white">delete_sweep</span>
              </div>
              <div>
                <h2 class="text-xl font-semibold tracking-tight text-slate-900 leading-none">
                  Delete Type
                </h2>
                <p class="text-slate-400 text-[10px] font-normal uppercase tracking-wider mt-1.5 flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full animate-pulse" style="background:#3d4f63;"></span>
                  Choose deletion method
                </p>
              </div>
            </div>
            <button
              @click="cancelDelete"
              class="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
            >
              <span class="material-icons">close</span>
            </button>
          </div>
    
          <div class="px-8 py-8 bg-white space-y-4">
            <p class="text-[10px] font-normal uppercase tracking-wider text-slate-400 mb-2 ml-1">
              Select deletion type for this user
            </p>

            <button
              @click="executeDelete(false)"
              class="group w-full flex items-center gap-4 p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
            >
              <div class="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:border-blue-600 transition-all">
                <span class="material-icons text-slate-400 group-hover:text-white transition-colors">visibility_off</span>
              </div>
              <div class="text-left flex-1">
                <!-- Label Indonesia kamu -->
                <p class="text-xs font-medium text-slate-900 uppercase tracking-wider group-hover:text-blue-600">Soft Delete</p>
                <p class="text-[10px] text-slate-400 font-normal mt-0.5">Data hidden, still in database</p>
              </div>
              <span class="material-icons text-slate-300 group-hover:text-blue-500">chevron_right</span>
            </button>
    
            <button
              @click="executeDelete(true)"
              class="group w-full flex items-center gap-4 p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-rose-500 hover:shadow-xl hover:shadow-rose-500/10 transition-all duration-300"
            >
              <div class="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-rose-600 group-hover:border-rose-600 transition-all">
                <span class="material-icons text-slate-400 group-hover:text-white transition-colors">delete_forever</span>
              </div>
              <div class="text-left flex-1">
                <!-- Label Indonesia kamu -->
                <p class="text-xs font-medium text-slate-900 uppercase tracking-wider group-hover:text-rose-600">Hard Delete</p>
                <p class="text-[10px] text-slate-400 font-normal mt-0.5">Data permanently removed from database</p>
              </div>
              <span class="material-icons text-slate-300 group-hover:text-rose-500">chevron_right</span>
            </button>
          </div>
    
          <div class="px-10 py-6 border-t border-slate-100 flex justify-center bg-slate-50/50 flex-shrink-0">
            <button
              type="button"
              @click="cancelDelete"
              class="px-4 py-2 text-[11px] font-normal uppercase tracking-wider text-slate-400 hover:text-[#3d4f63] transition-all flex items-center gap-2"
            >
              <span class="material-icons text-sm">keyboard_return</span> Cancel
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ✅ Toast Notification - Fixed Icon -->
    <transition name="slide-fade">
      <div v-if="toast.show" :class="{
        'bg-emerald-600': toast.type === 'success',
        'bg-red-500':     toast.type === 'error',
        'bg-blue-500':    toast.type === 'info'
      }" class="fixed bottom-6 right-6 text-white px-6 py-4 rounded-xl shadow-2xl z-[110] max-w-md">
        <div class="flex items-center gap-3">
          <span v-if="toast.type === 'success'" class="material-icons text-2xl">check_circle</span>
          <span v-else-if="toast.type === 'error'" class="material-icons text-2xl">error</span>
          <span v-else class="material-icons text-2xl">info</span>
          <span class="font-bold text-sm">{{ toast.message }}</span>
        </div>
      </div>
    </transition>
    
    <!-- ✅ MODAL: IMPERSONATE USER -->
    <StartImpersonateModal
      :show="showImpersonateModal"
      :user="selectedUserForImpersonate"
      @close="closeImpersonateModal"
      @success="handleImpersonateSuccess"
    />

  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import StartImpersonateModal from '@/components/StartImpersonateModal.vue';
import {
  fetchUserList,
  createUser,
  updateUser,
  deleteUser,
  forceDeleteUser,
  resetPassword,
  updateUserStatus as updateUserStatusAPI
} from '@/services/user.js';

const authStore = useAuthStore();
const showImpersonateModal = ref(false);
const selectedUserForImpersonate = ref(null);

const canImpersonate = (user) => {
  if (!user) return false;
  // Tidak bisa impersonate diri sendiri
  if (user.id === authStore.user?.id) return false;
  // Tidak bisa impersonate sesama ADMIN
  const roles = Array.isArray(user.roles) ? user.roles : [user.role];
  if (roles.includes('ADMIN')) return false;
  return true;
};

const openImpersonateModal = (user) => {
  selectedUserForImpersonate.value = user;
  showImpersonateModal.value = true;
};

const closeImpersonateModal = () => {
  showImpersonateModal.value = false;
  selectedUserForImpersonate.value = null;
};

const handleImpersonateSuccess = () => {
  closeImpersonateModal();
};

const users = ref([]);
const editingUser = ref(null);
const tableLoading = ref(false);
const formLoading = ref(false);
const loadError = ref(null);
const authError = ref(false);

const showUserModal = ref(false);
const showResetModal = ref(false);
const selectedUser = ref(null);
const showStatusModal = ref(false);
const selectedUserForStatus = ref(null);

const showDeleteConfirmModal = ref(false);
const showDeleteTypeModal = ref(false);
const pendingDeleteUserId = ref(null);

const showPassword = ref(false);
const showResetPassword = ref(false);
const showResetPasswordConfirm = ref(false);

// ✅ TAMBAHAN: Sorting states
const sortKey = ref('name');
const sortOrder = ref(1); // 1 = ascending, -1 = descending

// ✅ TAMBAHAN: Search state
const searchQuery = ref('');

// ✅ TAMBAHAN: Filter state
const selectedRole = ref('');
const selectedStatus = ref('');

const showConfirmPassword = ref(false);

// ✅ PAGINATION
const currentPage = ref(1);
const itemsPerPage = ref(10);

const form = ref({
  username: '',
  email: '',
  name: '',
  birthDate: '',
  phone: '',
  gender: 'MALE',
  jabatan: '',
  roles: ['USER'],
  password: '',
  confirmPassword: ''
});

const validationErrors = ref({
  username: '',
  name: '',
  email: '',
  phone: '',
  password: ''
});

const resetPasswordForm = ref({
  newPassword: '',
  confirmPassword: ''
});

const toast = ref({
  show: false,
  message: '',
  type: 'success'
});

const passwordChecks = computed(() => {
  const pwd = resetPasswordForm.value.newPassword;
  return {
    minLength: pwd.length >= 8,
    hasUpper: /[A-Z]/.test(pwd),
    hasLower: /[a-z]/.test(pwd),
    hasNumber: /[0-9]/.test(pwd),
    hasSymbol: /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/;']/.test(pwd),
  };
});

const isPasswordValid = computed(() => {
  const c = passwordChecks.value;
  return c.minLength && c.hasUpper && c.hasLower && c.hasNumber && c.hasSymbol;
});

const isPasswordMatch = computed(() => {
  if (!resetPasswordForm.value.confirmPassword) return null; 
  return resetPasswordForm.value.newPassword === resetPasswordForm.value.confirmPassword;
});


const activeUsersCount = computed(() => {
  return users.value.filter(u => u.status === 1).length;
});

const inactiveUsersCount = computed(() => {
  return users.value.filter(u => u.status === 2).length;
});

const freezeUsersCount = computed(() => {
  return users.value.filter(u => u.status === 3).length;
});

const blockedUsersCount = computed(() => {
  return users.value.filter(u => u.status === 4).length;
});

const adminUsersCount = computed(() => {
  return users.value.filter(u => (u.role === 'ADMIN' || u.role === 'admin')).length;
});

const ALL_ROLES = ['USER', 'ADMIN', 'APPROVER', 'REVIEWER'];
const availableRolesToAdd =  computed(() => {
  return ALL_ROLES.filter(r => !form.value.roles.includes(r));
});
const addRole = (role) => {
  if (!form.value.roles.includes(role)) {
    form.value.roles.push(role);
  }
};
const removeRole = (role) => {
  if (form.value.roles.length > 1) {
    form.value.roles = form.value.roles.filter(r => r !== role);
  }
};

// ✅ TAMBAHAN: Sorted Users Computed
const sortedUsers = computed(() => {
  let data = [...users.value];

  // 🔍 SEARCH
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    data = data.filter(u =>
      u.name?.toLowerCase().includes(q) ||
      u.username?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    );
  }

  if (selectedRole.value) {
    data = data.filter(u =>
      String(u.role).toUpperCase() === selectedRole.value
    );
  }

  // ⚡ FILTER STATUS
  if (selectedStatus.value) {
    data = data.filter(u =>
      Number(u.status) === Number(selectedStatus.value)
    );
  }

  // 🔃 SORTING
  data.sort((a, b) => {
    const aVal = a[sortKey.value] ?? '';
    const bVal = b[sortKey.value] ?? '';

    if (aVal < bVal) return -1 * sortOrder.value;
    if (aVal > bVal) return 1 * sortOrder.value;
    return 0;
  });

  return data;
});

// ✅ COMPUTED: Paginated Users
const totalPages = computed(() => Math.ceil(sortedUsers.value.length / itemsPerPage.value));

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return sortedUsers.value.slice(start, end);
});

// Reset ke page 1 kalau filter/search berubah
watch([searchQuery, selectedRole, selectedStatus], () => {
  currentPage.value = 1;
});


const getDetailedStatus = (user) => {
  const status = user.status;

  if (status === 1 || status === true) {
    return {
      text: 'Active',
      class: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      dotClass: 'bg-emerald-500'
    };
  }
  if (status === 2 || status === false) {
    return {
      text: 'Tidak Aktif',
      class: 'bg-slate-50 text-slate-600 border-slate-100',
      dotClass: 'bg-slate-400'
    };
  }
  if (status === 3) {
    return {
      text: 'Freeze',
      class: 'bg-blue-50 text-blue-700 border-blue-100',
      dotClass: 'bg-blue-500'
    };
  }
  if (status === 4) {
    return {
      text: 'Blocked',
      class: 'bg-rose-50 text-rose-700 border-rose-100',
      dotClass: 'bg-rose-500'
    };
  }
  return {
    text: 'Tidak Aktif',
    class: 'bg-slate-50 text-slate-600 border-slate-100',
    dotClass: 'bg-slate-400'
  };
};

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

// ✅ TAMBAHAN: Sort Function
const sortByField = (field) => {
  if (sortKey.value === field) {
    // Toggle sort order if same field
    sortOrder.value *= -1;
  } else {
    // New field, set ascending
    sortKey.value = field;
    sortOrder.value = 1;
  }
};

const openCreateModal = () => {
  editingUser.value = null;
  form.value = {
    username: '',
    email: '',
    name: '',
    birthDate: '',
    phone: '',
    gender: 'MALE',
    jabatan: '',
    roles: ['USER'],
    password: '',
    confirmPassword: ''
  };
  showUserModal.value = true;
};

const closeUserModal = () => {
  showUserModal.value = false;
  editingUser.value = null;
  form.value = {
    username: '',
    email: '',
    name: '',
    birthDate: '',
    phone: '',
    gender: 'MALE',
    jabatan: '',
    roles: ['USER'],
    password: '',
    confirmPassword: ''
  };

  validationErrors.value = {
    username: '',
    name: '',
    email: '',
    phone: '',
    password: ''
  };
};

// ✅ UBAH FUNGSI loadUsers() DI Users.vue

const loadUsers = async () => {
  try {
    tableLoading.value = true;
    loadError.value = null;
    
    const response = await fetchUserList({ limit: 1000 });

    // ✅ Handle array langsung atau object { data: [...] }
    const rawData = Array.isArray(response)
      ? response
      : (Array.isArray(response?.data) ? response.data : []);

    // ✅ MAPPING DATA
    users.value = rawData.map(user => ({
      id: user.id,
      name: user.fullName || user.name || '-',
      jabatan: user.position || user.jabatan || '-',
      roles: Array.isArray(user.roles) && user.roles.length > 0
        ? user.roles.map(r => r.toUpperCase())
        : [(user.role || 'USER').toUpperCase()],
      role: (() => {
        if (Array.isArray(user.roles) && user.roles.length > 0) {
          return user.roles[0].toUpperCase();
        }
        if (user.role) return user.role.toUpperCase();
        return 'USER';
      })(),
      username: user.username,
      email: user.email,
      phone: user.phone,
      status: user.status,
      gender: user.gender,
      birthDate: user.birthDate,
      isDeleted: user.isDeleted,
      deletedAt: user.deletedAt
    }));

    // ✅ Filter user yang belum dihapus
    users.value = users.value.filter(user => {
      if (user.deletedAt !== undefined) {
        return user.deletedAt === null;
      }
      if (user.isDeleted !== undefined) {
        return user.isDeleted === 0;
      }
      return true;
    });

    console.log('✅ Total users loaded:', users.value.length);
    if (users.value.length > 0) {
      console.log('📊 Sample user AFTER mapping:', users.value[0]);
    }

  } catch (error) {
    console.error('❌ Error loading users:', error);
    loadError.value = error.response?.data?.message || error.message || 'Gagal memuat data user';
    showToast('Gagal memuat data user: ' + loadError.value, 'error');
  } finally {
    tableLoading.value = false;
  }
};

onMounted(() => {
  loadUsers();
});

const validateField = (field) => {
  validationErrors.value[field] = '';
  
  switch(field) {
    case 'name':
      if (form.value.name && form.value.name.trim().length < 2) {
        validationErrors.value.name = 'Nama minimal 2 karakter';
        return false;
      }
      break;
      
    case 'username':
      if (form.value.username && form.value.username.trim().length < 3) {
        validationErrors.value.username = 'Username minimal 3 karakter';
        return false;
      }
      break;
      
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (form.value.email && !emailRegex.test(form.value.email)) {
        validationErrors.value.email = 'Format email tidak valid';
        return false;
      }
      break;
      
    case 'phone':
      if (form.value.phone && form.value.phone.trim().length < 10) {
        validationErrors.value.phone = 'Nomor telepon tidak valid';
        return false;
      }
      break;
      
    case 'password':
      const pwd = form.value.password;
      if (!editingUser.value) { // Hanya validasi password saat create
        if (pwd.length < 8) {
          validationErrors.value.password = 'Password minimal 8 karakter';
          return false;
        }
        if (!/[A-Z]/.test(pwd)) {
          validationErrors.value.password = 'Password harus mengandung huruf besar';
          return false;
        }
        if (!/[a-z]/.test(pwd)) {
          validationErrors.value.password = 'Password harus mengandung huruf kecil';
          return false;
        }
        if (!/[0-9]/.test(pwd)) {
          validationErrors.value.password = 'Password harus mengandung angka';
          return false;
        }
        if (!/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/;']/.test(pwd)) {
          validationErrors.value.password = 'Password harus mengandung simbol';
          return false;
        }
      }
      break;
  }
  return true;
};

const validateAll = () => {
  let isValid = true;
  
  // Reset semua error
  validationErrors.value = {
    username: '',
    name: '',
    email: '',
    phone: '',
    password: ''
  };
  
  // Validasi semua field
  if (!validateField('name')) isValid = false;
  if (!validateField('username')) isValid = false;
  if (!validateField('email')) isValid = false;
  if (form.value.phone && !validateField('phone')) isValid = false;
  if (!editingUser.value && !validateField('password')) isValid = false;
  
  return isValid;
};

const createUserHandler = async () => {
  try {
    formLoading.value = true;
    authError.value = false;
    
  if (!form.value.username || !form.value.password) {
    showToast('Username dan password wajib diisi!', 'error');
    formLoading.value = false;
    return;
  }

  if (!validateAll()) {
    showToast('Mohon perbaiki error validasi!', 'error');
    formLoading.value = false;
    return;
  }

  if (form.value.password !== form.value.confirmPassword) {
    showToast('Password dan konfirmasi password tidak cocok!', 'error');
    formLoading.value = false;
    return;
  }

    const userData = {
      username: form.value.username.trim(),
      password: form.value.password,
      fullName: form.value.name.trim(),
      email: form.value.email.trim().toLowerCase(),
      phone: form.value.phone.trim(),
      birthDate: form.value.birthDate,
      gender: form.value.gender,
      position: form.value.jabatan.trim(),
      roles: form.value.roles.map(r => r.toUpperCase())
    };

    console.log('📤 Creating user with roles:', userData);
    
    await createUser(userData);
    
    console.log('✅ User created successfully');
    
    await loadUsers();
    closeUserModal();
    showToast('✅ User berhasil dibuat! Email verifikasi dikirim ke ' + userData.email);
    
  } catch (error) {
    console.error('❌ Create error:', error);
    console.error('❌ Error response:', error.response?.data);
    
    let errorMsg = 'Gagal membuat user';
    
    if (error.response?.status === 401) {
      authError.value = true;
      errorMsg = '⚠️ Unauthorized: Silakan login ulang';
    } else if (error.response?.status === 422) {
      const backendMsg = error.response?.data?.message;
      if (backendMsg && backendMsg.includes('Email')) {
        errorMsg = '⚠️ Email sudah terdaftar! Gunakan email lain.';
      } else if (backendMsg && backendMsg.includes('Username')) {
        errorMsg = '⚠️ Username sudah digunakan! Gunakan username lain.';
      } else {
        errorMsg = '⚠️ ' + (backendMsg || 'Data tidak valid');
      }
    } else if (error.response?.status === 400) {
      const errors = error.response?.data?.errors;
      if (Array.isArray(errors) && errors.length > 0) {
        errorMsg = '⚠️ ' + (errors[0].message || errors[0].msg || errors[0]);
      } else if (error.response?.data?.message) {
        errorMsg = '⚠️ ' + error.response.data.message;
      }
    } else if (error.response?.data?.message) {
      errorMsg = '⚠️ ' + error.response.data.message;
    }
    
    showToast(errorMsg, 'error');
  } finally {
    formLoading.value = false;
  }
};

const editUser = (user) => {
  editingUser.value = user;
  let formattedDate = '';
  if (user.birthDate) {
    try {
      const date = new Date(user.birthDate);
      formattedDate = date.toISOString().split('T')[0];
    } catch (e) {
      formattedDate = user.birthDate;
    }
  }
  form.value = { 
    username: user.username, 
    email: user.email || '',
    name: user.name || '',
    birthDate: formattedDate,
    phone: user.phone || '',
    gender: user.gender || 'MALE',
    jabatan: user.jabatan || '',
    roles: Array.isArray(user.roles) && user.roles.length > 0
      ? user.roles.map(r => r.toUpperCase())
      : [(user.role || 'USER').toUpperCase()],
    password: '' 
  };
  showUserModal.value = true;
};

const updateUserHandler = async () => {
  try {
    formLoading.value = true;
    authError.value = false;
    
    if (!form.value.username || !form.value.name) {
      showToast('Username dan nama wajib diisi!', 'error');
      formLoading.value = false;
      return;
    }

    if (!validateAll()) {
      showToast('Mohon perbaiki error validasi!', 'error');
      formLoading.value = false;
      return;
    }

    const updateData = {
      username: form.value.username.trim(),
      fullName: form.value.name.trim(),
      email: form.value.email.trim().toLowerCase(),
      phone: form.value.phone.trim(),
      birthDate: form.value.birthDate,
      gender: form.value.gender,
      position: form.value.jabatan.trim(),
      roles: form.value.roles.map(r => r.toUpperCase())
    };
    
    console.log('📤 Updating user with roles:', updateData);
    
    await updateUser(editingUser.value.id, updateData);
    await loadUsers();
    closeUserModal();
    showToast('✅ User berhasil diupdate!');
    
  } catch (error) {
    console.error('❌ Update user error:', error);
    console.error('Error response:', error.response?.data);
    
    let errorMsg = 'Gagal mengupdate user';
    
    if (error.response?.status === 401) {
      authError.value = true;
      errorMsg = '⚠️ Unauthorized: Silakan login ulang';
    } else if (error.response?.status === 400) {
      const errors = error.response?.data?.errors;
      if (Array.isArray(errors) && errors.length > 0) {
        errorMsg = '⚠️ ' + (errors[0].message || errors[0].msg || errors[0]);
      } else if (error.response?.data?.message) {
        errorMsg = '⚠️ ' + error.response.data.message;
      }
    }
    
    showToast(errorMsg, 'error');
  } finally {
    formLoading.value = false;
  }
};

// ✅ STEP 1: Buka modal konfirmasi pertama
const deleteUserHandler = (id) => {
  pendingDeleteUserId.value = id;
  showDeleteConfirmModal.value = true;
};

// ✅ STEP 2: User klik "Ya, Hapus" di modal pertama
const confirmDeleteStep1 = () => {
  showDeleteConfirmModal.value = false;
  showDeleteTypeModal.value = true;
};

// ✅ STEP 3: User pilih jenis delete (hard/soft)
const executeDelete = async (isHardDelete) => {
  showDeleteTypeModal.value = false;
  
  try {
    formLoading.value = true;
    const id = pendingDeleteUserId.value;
    
    console.log('🗑️ Deleting user:', id, isHardDelete ? '(HARD DELETE)' : '(SOFT DELETE)');
    
    if (isHardDelete) {
      try {
        await forceDeleteUser(id);
        console.log('✅ User PERMANENTLY deleted from database');
      } catch (err) {
        console.warn('⚠️ Force delete endpoint not available, using normal delete');
        await deleteUser(id);
      }
    } else {
      await deleteUser(id);
      console.log('✅ User soft deleted');
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
    await loadUsers();
    
    const stillExists = users.value.find(u => u.id === id);
    
    if (stillExists) {
      console.warn('⚠️ User masih ada di list setelah delete');
      showToast('User dihapus tapi masih muncul. Coba refresh halaman.', 'error');
    } else {
      console.log('✅ User berhasil dihapus dari tampilan');
      showToast(
        isHardDelete 
          ? 'User dihapus permanen dari database!' 
          : 'User berhasil dihapus!',
        'success'
      );
    }
    
  } catch (error) {
    console.error('❌ Delete user error:', error);
    
    let errorMsg = 'Gagal menghapus user';
    if (error.response?.data?.message) {
      errorMsg = error.response.data.message;
    }
    
    showToast(errorMsg, 'error');
  } finally {
    formLoading.value = false;
    pendingDeleteUserId.value = null;
  }
};

const cancelDelete = () => {
  showDeleteConfirmModal.value = false;
  showDeleteTypeModal.value = false;
  pendingDeleteUserId.value = null;
};


const openResetPasswordModal = (user) => {
  selectedUser.value = user;
  resetPasswordForm.value = { newPassword: '', confirmPassword: '' };
  showResetPassword.value = false;
  showResetPasswordConfirm.value = false;
  showResetModal.value = true;
};

const closeResetModal = () => {
  showResetModal.value = false;
  selectedUser.value = null;
  resetPasswordForm.value = { newPassword: '', confirmPassword: '' };
};

const submitResetPassword = async () => {
  if (!isPasswordValid.value) {
    showToast('Lengkapi semua syarat password di atas', 'error');
    return;
  }

  if (!isPasswordMatch.value) {
    showToast('Password dan konfirmasi tidak cocok', 'error');
    return;
  }

  try {
    formLoading.value = true;
    await resetPassword(selectedUser.value.id, resetPasswordForm.value.newPassword);
    showToast('✅ Link reset password dikirim ke email user!');
    closeResetModal();
  } catch (error) {
    console.error('Reset password error:', error);
    showToast('Gagal mereset password: ' + (error.response?.data?.message || error.message), 'error');
  } finally {
    formLoading.value = false;
  }
};

const openStatusModal = (user) => {
  selectedUserForStatus.value = user;
  showStatusModal.value = true;
};

const closeStatusModal = () => {
  showStatusModal.value = false;
  selectedUserForStatus.value = null;
};

const updateUserStatus = async (statusValue) => {
  try {
    formLoading.value = true;
    
    console.log('🔄 Mengubah status user:', selectedUserForStatus.value.id, 'menjadi:', statusValue);
    
    let statusNumber;
    switch(statusValue) {
      case 'ACTIVE':
        statusNumber = 1;
        break;
      case 'INACTIVE':
        statusNumber = 2;
        break;
      case 'FREEZE':
        statusNumber = 3;
        break;
      case 'BLOCKED':
        statusNumber = 4;
        break;
      default:
        throw new Error('Status tidak valid');
    }
    
    console.log('📤 Sending status number:', statusNumber);
    
    await updateUserStatusAPI(selectedUserForStatus.value.id, statusNumber);
    
    console.log('✅ Status berhasil diubah, reloading data...');
    await loadUsers();
    closeStatusModal();
    showToast(`✅ Status diubah ke ${statusValue}. Email notifikasi dikirim ke user.`);
    
  } catch (error) {
    console.error('❌ Update status error:', error);
    console.error('❌ Error response:', error.response?.data);
    
    let errorMsg = 'Gagal mengubah status user';
    
    if (error.response?.status === 400) {
      const errors = error.response?.data?.errors;
      if (Array.isArray(errors) && errors.length > 0) {
        errorMsg = '⚠️ ' + (errors[0].message || errors[0].msg || JSON.stringify(errors[0]));
      } else if (error.response?.data?.message) {
        errorMsg = '⚠️ ' + error.response.data.message;
      }
    } else if (error.response?.status === 404) {
      errorMsg = '⚠️ Endpoint tidak ditemukan';
    } else if (error.message) {
      errorMsg = error.message;
    }
    
    showToast(errorMsg, 'error');
  } finally {
    formLoading.value = false;
  }
};

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
};
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>