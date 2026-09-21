import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  LoaderCircle,
  RefreshCw,
} from 'lucide-react'
import {
  getUserById,
  getUsers,
  updateUserRole,
  updateUserStatus,
  USER_ROLES,
  USER_STATUSES,
  type UserListPage,
  type UserProfile,
  type UserRole,
  type UserStatus,
  type UserSummary,
} from '../../services/userService'
import DataTable from '../ui/DataTable'
import DropdownField, { type DropdownOption } from '../ui/DropdownField'
import Modal from '../ui/Modal'
import SearchFilterBar from '../ui/SearchFilterBar'
import StatusBadge from '../ui/StatusBadge'
import Button from '../ui/Button'

const PAGE_SIZE = 10

const ROLE_LABELS: Record<UserRole, string> = {
  STUDENT: 'Học viên',
  MENTOR: 'Mentor',
  TEACHER: 'Giáo viên',
  STAFF: 'Nhân viên',
  MANAGER: 'Quản lý',
  ADMINISTRATOR: 'Quản trị viên',
}

const STATUS_LABELS: Record<UserStatus, string> = {
  ACTIVE: 'Đang hoạt động',
  INACTIVE: 'Ngừng hoạt động',
  SUSPENDED: 'Tạm khóa',
  PENDING: 'Chờ xác minh',
}

const STATUS_FILTER_OPTIONS: DropdownOption[] = [
  { id: 'ALL', label: 'Tất cả trạng thái' },
  ...USER_STATUSES.map((status) => ({ id: status, label: STATUS_LABELS[status] })),
]

const ROLE_OPTIONS: DropdownOption[] = USER_ROLES.map((role) => ({
  id: role,
  label: ROLE_LABELS[role],
}))

const ROLE_FILTER_LABELS = ['Tất cả vai trò', ...USER_ROLES.map((role) => ROLE_LABELS[role])]

const ROLE_BY_FILTER_LABEL = Object.fromEntries(
  USER_ROLES.map((role) => [ROLE_LABELS[role], role]),
) as Record<string, UserRole | undefined>

function emptyPage(): UserListPage {
  return {
    content: [],
    pageNumber: 0,
    pageSize: PAGE_SIZE,
    totalElements: 0,
    totalPages: 0,
    last: true,
  }
}

type UserNameSource = Pick<UserSummary, 'displayName' | 'email'> &
  Partial<Pick<UserSummary, 'firstName' | 'lastName'>>

function getUserName(user: UserNameSource) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim()
  return user.displayName || fullName || user.email
}

function getInitials(user: Pick<UserSummary, 'firstName' | 'lastName' | 'email'>) {
  const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.trim()
  return initials || user.email.slice(0, 2).toUpperCase()
}

function formatDate(value?: string, emptyLabel = 'Chưa cập nhật') {
  if (!value) return emptyLabel
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Không xác định'
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function getStatusTone(status: UserStatus) {
  if (status === 'ACTIVE') return 'success' as const
  if (status === 'SUSPENDED') return 'danger' as const
  if (status === 'PENDING') return 'warning' as const
  return 'neutral' as const
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Đã xảy ra lỗi. Vui lòng thử lại.'
}

function UserManagement() {
  const [page, setPage] = useState(0)
  const [roleFilter, setRoleFilter] = useState<UserRole | 'ALL'>('ALL')
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'ALL'>('ALL')
  const [query, setQuery] = useState('')
  const [pageData, setPageData] = useState<UserListPage>(emptyPage)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    let ignore = false

    // The request lifecycle starts when the server-side filters or page change.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    setError('')

    getUsers({
      page,
      size: PAGE_SIZE,
      role: roleFilter === 'ALL' ? undefined : roleFilter,
      status: statusFilter === 'ALL' ? undefined : statusFilter,
      sort: 'createdAt,desc',
    })
      .then((nextPage) => {
        if (!ignore) setPageData(nextPage)
      })
      .catch((requestError: unknown) => {
        if (!ignore) setError(getErrorMessage(requestError))
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [page, reloadKey, roleFilter, statusFilter])

  const visibleUsers = useMemo(() => {
    const normalizedQuery = query
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .toLocaleLowerCase('vi-VN')
      .trim()

    if (!normalizedQuery) return pageData.content

    return pageData.content.filter((user) => {
      const haystack = [
        user.email,
        user.displayName,
        user.firstName,
        user.lastName,
        ROLE_LABELS[user.role],
      ]
        .filter(Boolean)
        .join(' ')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .toLocaleLowerCase('vi-VN')

      return haystack.includes(normalizedQuery)
    })
  }, [pageData.content, query])

  const updateUserInPage = useCallback((userId: string, updated: UserProfile) => {
    setPageData((current) => ({
      ...current,
      content: current.content.map((user) =>
        user.id === userId
          ? {
              ...user,
              displayName: updated.displayName ?? user.displayName,
              firstName: updated.firstName ?? user.firstName,
              lastName: updated.lastName ?? user.lastName,
              avatarUrl: updated.avatarUrl ?? user.avatarUrl,
              status: updated.status ?? user.status,
              role: updated.role ?? user.role,
              emailVerified: updated.emailVerified ?? user.emailVerified,
              lastLoginAt: updated.lastLoginAt ?? user.lastLoginAt,
              createdAt: updated.createdAt ?? user.createdAt,
            }
          : user,
      ),
    }))
    setSelectedUser((current) => (current?.id === userId ? { ...current, ...updated } : current))
  }, [])

  const handleStatusChange = useCallback(
    async (userId: string, nextStatus: UserStatus) => {
      setUpdatingUserId(userId)
      setError('')
      setFeedback('')
      try {
        const updated = await updateUserStatus(userId, nextStatus)
        updateUserInPage(userId, updated)
        setFeedback('Đã cập nhật trạng thái tài khoản.')
      } catch (requestError: unknown) {
        setError(getErrorMessage(requestError))
      } finally {
        setUpdatingUserId(null)
      }
    },
    [updateUserInPage],
  )

  const handleRoleChange = useCallback(
    async (userId: string, nextRole: UserRole) => {
      setUpdatingUserId(userId)
      setError('')
      setFeedback('')
      try {
        const updated = await updateUserRole(userId, nextRole)
        updateUserInPage(userId, updated)
        setFeedback('Đã cập nhật vai trò tài khoản.')
      } catch (requestError: unknown) {
        setError(getErrorMessage(requestError))
      } finally {
        setUpdatingUserId(null)
      }
    },
    [updateUserInPage],
  )

  const openUserDetail = useCallback(async (user: UserSummary) => {
    setSelectedUser({
      ...user,
      phone: undefined,
      bio: undefined,
      timezone: undefined,
      language: undefined,
    })
    setDetailLoading(true)
    try {
      setSelectedUser(await getUserById(user.id))
    } catch (requestError: unknown) {
      setError(getErrorMessage(requestError))
    } finally {
      setDetailLoading(false)
    }
  }, [])

  const columns = useMemo<ColumnDef<UserSummary>[]>(
    () => [
      {
        id: 'user',
        header: 'Tài khoản',
        accessorKey: 'email',
        cell: ({ row }) => (
          <div className="flex min-w-56 items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-badge-info-bg text-sm font-semibold text-badge-info-text">
              {getInitials(row.original)}
            </span>
            <span className="min-w-0">
              <strong className="block truncate font-semibold text-text-heading">
                {getUserName(row.original)}
              </strong>
              <small className="block truncate text-text-muted">{row.original.email}</small>
            </span>
          </div>
        ),
      },
      {
        id: 'role',
        header: 'Vai trò',
        cell: ({ row }) => (
          <div className="min-w-36" onClick={(event) => event.stopPropagation()}>
            <DropdownField
              ariaLabel={`Vai trò của ${row.original.email}`}
              options={ROLE_OPTIONS}
              value={row.original.role}
              isDisabled={updatingUserId === row.original.id}
              triggerClassName="h-9 min-w-32 px-2 text-xs"
              onChange={(value) => {
                if (value && value !== row.original.role) {
                  void handleRoleChange(row.original.id, value as UserRole)
                }
              }}
            />
          </div>
        ),
      },
      {
        id: 'status',
        header: 'Trạng thái',
        cell: ({ row }) => (
          <div className="flex min-w-52 items-center gap-2" onClick={(event) => event.stopPropagation()}>
            <StatusBadge tone={getStatusTone(row.original.status)}>
              {STATUS_LABELS[row.original.status]}
            </StatusBadge>
            <DropdownField
              ariaLabel={`Trạng thái của ${row.original.email}`}
              options={STATUS_FILTER_OPTIONS.slice(1)}
              value={row.original.status}
              isDisabled={updatingUserId === row.original.id}
              triggerClassName="h-9 min-w-32 px-2 text-xs"
              onChange={(value) => {
                if (value && value !== row.original.status) {
                  void handleStatusChange(row.original.id, value as UserStatus)
                }
              }}
            />
          </div>
        ),
      },
      {
        accessorKey: 'lastLoginAt',
        header: 'Đăng nhập gần nhất',
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-sm text-text-muted">
            {formatDate(row.original.lastLoginAt, 'Chưa đăng nhập')}
          </span>
        ),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div onClick={(event) => event.stopPropagation()}>
            <Button
              variant="primary"
              appearance="ghost"
              size="sm"
              className="text-xs"
              onClick={() => void openUserDetail(row.original)}
            >
              <Eye size={15} />
              Chi tiết
            </Button>
          </div>
        ),
      },
    ],
    [handleRoleChange, handleStatusChange, openUserDetail, updatingUserId],
  )

  return (
    <section className="overflow-hidden rounded-2xl border border-border-subtle bg-surface shadow-sm" aria-busy={loading}>
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border-subtle px-5 py-4">
        <div>
          <h2 className="text-lg font-semibold text-text-heading">Danh sách</h2>
        </div>
        <Button
          variant="primary"
          appearance="outline"
          size="sm"
          onClick={() => setReloadKey((current) => current + 1)}
          disabled={loading}
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : undefined} />
          Làm mới
        </Button>
      </div>

      <SearchFilterBar
        query={query}
        onQueryChange={setQuery}
        placeholder="Tên hoặc email…"
        filter={roleFilter === 'ALL' ? ROLE_FILTER_LABELS[0] : ROLE_LABELS[roleFilter]}
        onFilterChange={(label) => {
          setRoleFilter(ROLE_BY_FILTER_LABEL[label] ?? 'ALL')
          setPage(0)
        }}
        filterOptions={ROLE_FILTER_LABELS}
        additionalFilters={
          <DropdownField
            ariaLabel="Lọc theo trạng thái"
            options={STATUS_FILTER_OPTIONS}
            value={statusFilter}
            onChange={(value) => {
              setStatusFilter((value as UserStatus | null) ?? 'ALL')
              setPage(0)
            }}
            triggerClassName="inline-flex h-10 w-auto min-w-40 cursor-pointer items-center gap-2 rounded-[9px] border border-border-subtle bg-surface px-3 text-sm font-semibold text-text-label outline-none"
          />
        }
        resultCount={visibleUsers.length}
        resultLabel="tài khoản trên trang"
      />

      {feedback && (
        <div className="mx-5 mt-4 flex items-center gap-2 rounded-lg bg-badge-success-bg px-3 py-2 text-sm text-badge-success-text" role="status">
          <CheckCircle2 size={16} />
          {feedback}
        </div>
      )}

      {error && (
        <div className="mx-5 mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-badge-danger-bg px-3 py-2 text-sm text-badge-danger-text" role="alert">
          <span className="flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </span>
          <Button variant="danger" appearance="ghost" size="sm" onClick={() => setReloadKey((current) => current + 1)}>
            Thử lại
          </Button>
        </div>
      )}

      <DataTable
        columns={columns}
        data={visibleUsers}
        getRowKey={(user) => user.id}
        onRowClick={(user) => void openUserDetail(user)}
        emptyMessage={
          loading ? (
            <span className="inline-flex items-center gap-2">
              <LoaderCircle size={16} className="animate-spin" />
              Đang tải danh sách người dùng...
            </span>
          ) : (
            'Không tìm thấy tài khoản phù hợp.'
          )
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle px-5 py-3 text-sm text-text-muted">
        <span>
          Trang {pageData.totalPages ? page + 1 : 0} / {pageData.totalPages || 0} · {pageData.totalElements} tài khoản
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            appearance="outline"
            size="sm"
            disabled={loading || page <= 0}
            onClick={() => setPage((current) => Math.max(0, current - 1))}
            aria-label="Trang trước"
          >
            <ChevronLeft size={16} />
          </Button>
          <Button
            variant="primary"
            appearance="outline"
            size="sm"
            disabled={loading || page + 1 >= pageData.totalPages}
            onClick={() => setPage((current) => current + 1)}
            aria-label="Trang sau"
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      <Modal
        open={Boolean(selectedUser)}
        onClose={() => setSelectedUser(null)}
        title="Chi tiết tài khoản"
        description={selectedUser?.email}
        maxWidth={620}
      >
        {detailLoading ? (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-text-muted">
            <LoaderCircle size={18} className="animate-spin" />
            Đang tải thông tin...
          </div>
        ) : selectedUser ? (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold tracking-wide text-text-subtle uppercase">Họ và tên</p>
                <p className="mt-1 font-medium text-text-heading">{getUserName(selectedUser)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wide text-text-subtle uppercase">Email</p>
                <p className="mt-1 break-all font-medium text-text-heading">{selectedUser.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wide text-text-subtle uppercase">Số điện thoại</p>
                <p className="mt-1 text-text-body">{selectedUser.phone || 'Chưa cập nhật'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wide text-text-subtle uppercase">Xác thực email</p>
                <p className="mt-1 text-text-body">{selectedUser.emailVerified ? 'Đã xác thực' : 'Chưa xác thực'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wide text-text-subtle uppercase">Ngày tạo</p>
                <p className="mt-1 text-text-body">{formatDate(selectedUser.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wide text-text-subtle uppercase">Đăng nhập gần nhất</p>
                <p className="mt-1 text-text-body">{formatDate(selectedUser.lastLoginAt, 'Chưa đăng nhập')}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 border-t border-border-subtle pt-4">
              <StatusBadge tone={getStatusTone(selectedUser.status ?? 'PENDING')}>
                {STATUS_LABELS[selectedUser.status ?? 'PENDING']}
              </StatusBadge>
              <StatusBadge tone="info">{ROLE_LABELS[selectedUser.role]}</StatusBadge>
            </div>
          </div>
        ) : null}
      </Modal>
    </section>
  )
}

export default UserManagement
