import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor, within } from '../test-utils';
import UserListHeader from '../../components/users/UserListHeader';
import type { GenericUser, SearchTag, Student, Staff } from '../../types';

const createStudent = (overrides: Partial<Student>): Student => ({
  documentNumber: 'DOC-1',
  studentCode: 'STU-1',
  paternalLastName: 'Pérez',
  maternalLastName: 'López',
  names: 'Ana',
  fullName: 'Ana Pérez',
  gender: 'Mujer',
  birthDate: '2010-01-01',
  grade: '5',
  section: 'A',
  avatarUrl: 'https://example.com/avatar.png',
  tutorIds: [],
  enrollmentStatus: 'Matriculado',
  status: 'Activo',
  sede: 'Norte',
  lastLogin: null,
  condition: 'Regular',
  tags: [],
  averageGrade: 0,
  attendancePercentage: 0,
  tardinessCount: 0,
  behaviorIncidents: 0,
  academicRisk: false,
  ...overrides,
});

const createStaff = (overrides: Partial<Staff>): Staff => ({
  dni: 'DNI-1',
  name: 'Default Staff',
  area: 'Ciencia',
  role: 'Docente',
  avatarUrl: 'https://example.com/staff.png',
  category: 'Docente',
  status: 'Activo',
  sede: 'Norte',
  lastLogin: null,
  tags: [],
  ...overrides,
});

const students: Student[] = [
  createStudent({
    documentNumber: 'DOC-ALICE',
    studentCode: 'STU-ALICE',
    fullName: 'Alice Johnson',
    names: 'Alice',
    paternalLastName: 'Johnson',
    maternalLastName: 'Stone',
    avatarUrl: 'https://example.com/alice.png',
  }),
  createStudent({
    documentNumber: 'DOC-ALICIA',
    studentCode: 'STU-ALICIA',
    fullName: 'Alícia Márquez',
    names: 'Alícia',
    paternalLastName: 'Márquez',
    maternalLastName: 'Diaz',
    avatarUrl: 'https://example.com/alicia.png',
  }),
];

const staffMember: Staff = createStaff({
  dni: 'DNI-ALBERT',
  name: 'Albert Rivera',
  avatarUrl: 'https://example.com/albert.png',
});

const allUsers: GenericUser[] = [...students, staffMember];

afterEach(() => {
  vi.clearAllMocks();
});

describe('UserListHeader', () => {
  it('renders placeholder text and combobox aria attributes via translations', () => {
    const onAddTag = vi.fn();
    const onRemoveTag = vi.fn();

    render(
      <UserListHeader tags={[]} allUsers={allUsers} onAddTag={onAddTag} onRemoveTag={onRemoveTag} />,
    );

    expect(screen.getByText('Search (name, ID, role, grade: 5A)…')).toBeInTheDocument();

    const input = screen.getByTestId('userlist-search-input');
    expect(input).toHaveAttribute('role', 'combobox');
    expect(input).toHaveAttribute('aria-autocomplete', 'list');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).toHaveAttribute('aria-controls', 'user-suggestions-list');
    expect(input).toHaveAttribute('aria-label', 'Add search filter');
  });

  it('respects minChars threshold before showing suggestions', async () => {
    const onAddTag = vi.fn();
    const onRemoveTag = vi.fn();
    const user = userEvent.setup();

    render(
      <UserListHeader tags={[]} allUsers={allUsers} onAddTag={onAddTag} onRemoveTag={onRemoveTag} />,
    );

    const input = screen.getByTestId('userlist-search-input');

    await user.type(input, 'a');

    await waitFor(() => {
      expect(screen.queryByTestId('userlist-suggestions')).not.toBeInTheDocument();
    });

    await user.type(input, 'l');

    await waitFor(() => {
      expect(screen.getByTestId('userlist-suggestions')).toBeInTheDocument();
    });

    expect(input).toHaveAttribute('aria-expanded', 'true');
  });

  it('limits rendered suggestions based on suggestionLimit', async () => {
    const onAddTag = vi.fn();
    const onRemoveTag = vi.fn();
    const user = userEvent.setup();

    render(
      <UserListHeader
        tags={[]}
        allUsers={allUsers}
        onAddTag={onAddTag}
        onRemoveTag={onRemoveTag}
        suggestionLimit={1}
      />,
    );

    const input = screen.getByTestId('userlist-search-input');
    await user.type(input, 'al');

    const list = await screen.findByTestId('userlist-suggestions');
    const options = within(list).getAllByRole('option');
    expect(options).toHaveLength(1);
  });

  it('hides suggestions when the grade pattern matches the input', async () => {
    const onAddTag = vi.fn();
    const onRemoveTag = vi.fn();
    const user = userEvent.setup();

    render(
      <UserListHeader tags={[]} allUsers={allUsers} onAddTag={onAddTag} onRemoveTag={onRemoveTag} />,
    );

    const input = screen.getByTestId('userlist-search-input');
    await user.type(input, '5A');

    await waitFor(() => {
      expect(screen.queryByTestId('userlist-suggestions')).not.toBeInTheDocument();
    });
  });

  it('supports keyboard navigation, selection, and escape handling', async () => {
    const onAddTag = vi.fn();
    const onRemoveTag = vi.fn();
    const user = userEvent.setup();

    render(
      <UserListHeader tags={[]} allUsers={allUsers} onAddTag={onAddTag} onRemoveTag={onRemoveTag} />,
    );

    const input = screen.getByTestId('userlist-search-input');
    await user.type(input, 'ali');

    const list = await screen.findByTestId('userlist-suggestions');
    const options = within(list).getAllByRole('option');

    await user.keyboard('{ArrowDown}');

    expect(input).toHaveAttribute('aria-activedescendant', 'user-suggestion-0');
    expect(options[0]).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{Enter}');

    expect(onAddTag).toHaveBeenCalledWith('Alice Johnson');
    expect(input).toHaveValue('');

    await waitFor(() => {
      expect(screen.queryByTestId('userlist-suggestions')).not.toBeInTheDocument();
    });

    await user.type(input, 'ali');
    await screen.findByTestId('userlist-suggestions');
    await user.keyboard('{Escape}');

    expect(input).toHaveValue('');
    await waitFor(() => {
      expect(screen.queryByTestId('userlist-suggestions')).not.toBeInTheDocument();
    });
  });

  it('uses custom getDisplayName when provided', async () => {
    const onAddTag = vi.fn();
    const onRemoveTag = vi.fn();
    const user = userEvent.setup();
    const customGetDisplayName = (userEntity: GenericUser) =>
      userEntity === students[0] ? 'Alpha' : 'Omega';

    render(
      <UserListHeader
        tags={[]}
        allUsers={allUsers}
        onAddTag={onAddTag}
        onRemoveTag={onRemoveTag}
        getDisplayName={customGetDisplayName}
      />,
    );

    const input = screen.getByTestId('userlist-search-input');
    await user.type(input, 'al');

    const list = await screen.findByTestId('userlist-suggestions');
    const options = within(list).getAllByRole('option');
    expect(options[0]).toHaveTextContent('Alpha');

    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');

    expect(onAddTag).toHaveBeenCalledWith('Alpha');
  });

  it('stops remove button propagation and uses translated aria-label', async () => {
    const onAddTag = vi.fn();
    const onRemoveTag = vi.fn();
    const parentClick = vi.fn();
    const user = userEvent.setup();
    const tags: SearchTag[] = [
      {
        value: 'Test Filter',
        displayValue: 'Test Filter',
        type: 'keyword',
        isValid: true,
      },
    ];

    render(
      <div onClick={parentClick}>
        <UserListHeader tags={tags} allUsers={allUsers} onAddTag={onAddTag} onRemoveTag={onRemoveTag} />
      </div>,
    );

    const removeButton = screen.getByRole('button', { name: 'Remove filter Test Filter' });
    await user.click(removeButton);

    expect(onRemoveTag).toHaveBeenCalledWith('Test Filter');
    expect(parentClick).not.toHaveBeenCalled();
  });
});
