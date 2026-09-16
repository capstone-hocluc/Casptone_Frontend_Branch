// Shared password strength rules - used by Register (AuthPage) and Change
// Password (Account Profile) so both forms enforce the exact same policy.
export const passwordRequirementRules = [
  {
    key: 'length',
    label: 'Ít nhất 8 ký tự',
    missingLabel: '8 ký tự',
    message: 'Mật khẩu phải có ít nhất 8 ký tự.',
    test: (value: string) => value.length >= 8,
  },
  {
    key: 'uppercase',
    label: 'Có chữ hoa',
    missingLabel: 'chữ hoa',
    message: 'Mật khẩu phải có ít nhất 1 chữ hoa.',
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    key: 'lowercase',
    label: 'Có chữ thường',
    missingLabel: 'chữ thường',
    message: 'Mật khẩu phải có ít nhất 1 chữ thường.',
    test: (value: string) => /[a-z]/.test(value),
  },
  {
    key: 'number',
    label: 'Có chữ số',
    missingLabel: 'chữ số',
    message: 'Mật khẩu phải có ít nhất 1 chữ số.',
    test: (value: string) => /\d/.test(value),
  },
  {
    key: 'special',
    label: 'Có ký tự đặc biệt',
    missingLabel: 'ký tự đặc biệt',
    message: 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt.',
    test: (value: string) => /[^A-Za-z0-9]/.test(value),
  },
]

export function getPasswordRequirements(value: string) {
  return passwordRequirementRules.map((rule) => ({
    ...rule,
    met: rule.test(value),
  }))
}

export function validatePassword(value: string) {
  if (!value) return 'Vui lòng nhập mật khẩu.'
  return getPasswordRequirements(value).find((rule) => !rule.met)?.message || ''
}

export function getPasswordIssues(value: string) {
  return getPasswordRequirements(value)
    .filter((rule) => !rule.met)
    .map((rule) => rule.label)
}

function joinRequirementLabels(labels: string[]) {
  if (labels.length <= 1) return labels[0] || ''
  if (labels.length === 2) return `${labels[0]} và ${labels[1]}`
  return `${labels.slice(0, -1).join(', ')} và ${labels[labels.length - 1]}`
}

export function getPasswordHelper(value: string) {
  if (!value) {
    return {
      text: 'Ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.',
      isError: false,
    }
  }

  const missingRules = getPasswordRequirements(value).filter((rule) => !rule.met)
  if (!missingRules.length) return { text: '', isError: false }

  const needsLength = missingRules.some((rule) => rule.key === 'length')
  const missingLabels = missingRules
    .filter((rule) => rule.key !== 'length')
    .map((rule) => rule.missingLabel)

  if (needsLength) {
    return {
      text: missingLabels.length
        ? `Mật khẩu cần ít nhất 8 ký tự và thêm ${joinRequirementLabels(missingLabels)}.`
        : 'Mật khẩu cần ít nhất 8 ký tự.',
      isError: true,
    }
  }

  return {
    text:
      missingLabels.length === 1
        ? `Mật khẩu cần có ít nhất 1 ${missingLabels[0]}.`
        : `Mật khẩu cần thêm ${joinRequirementLabels(missingLabels)}.`,
    isError: true,
  }
}
