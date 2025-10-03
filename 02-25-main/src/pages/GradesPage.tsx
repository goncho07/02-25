import React from 'react';
import { Page } from '@/components/common/Page';
import { DataTable } from '@/components/common/DataTable';
import { Filter } from '@/components/common/Filter';
import { Button } from '@/components/common/Button';
import { Form, FormField, Select } from '@/components/common/Form';
import { useApi, usePagination } from '@/hooks/useApi';
import { useToast } from '@/components/common/Toast';
import { ENDPOINTS } from '@/core/api';
import { Grade, Course, Student, Period } from '@/core/api/types';
import { COLORS, SPACING, ACADEMIC } from '@/core/constants';

const GradesPage: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = React.useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = React.useState<string>('');
  const { showToast } = useToast();

  // Obtener cursos
  const { data: courses, isLoading: coursesLoading } = useApi<Course[]>(
    ENDPOINTS.COURSES,
    {
      onError: (err) => showToast({ type: 'error', message: err.message }),
    }
  );

  // Obtener períodos
  const { data: periods, isLoading: periodsLoading } = useApi<Period[]>(
    ENDPOINTS.ACADEMIC_PERIODS,
    {
      onError: (err) => showToast({ type: 'error', message: err.message }),
    }
  );

  // Obtener calificaciones
  const {
    data: grades,
    isLoading: gradesLoading,
    refetch: refetchGrades,
  } = usePagination<Grade>(
    selectedCourse && selectedPeriod
      ? `${ENDPOINTS.GRADES}?courseId=${selectedCourse}&periodId=${selectedPeriod}`
      : ENDPOINTS.GRADES,
    {
      onError: (err) => showToast({ type: 'error', message: err.message }),
    }
  );

  const handleGradeChange = async (studentId: string, value: number) => {
    try {
      await fetch(`${ENDPOINTS.GRADES}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          courseId: selectedCourse,
          periodId: selectedPeriod,
          value,
        }),
      });
      
      refetchGrades();
      showToast({
        type: 'success',
        message: 'Calificación actualizada correctamente',
      });
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Error al actualizar la calificación',
      });
    }
  };

  const columns = [
    {
      key: 'studentId',
      title: 'Estudiante',
      render: (_: any, grade: Grade) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.SM }}>
          <div>
            <div style={{ fontWeight: 500 }}>
              {grade.student?.firstName} {grade.student?.lastName}
            </div>
            <div style={{ fontSize: '12px', color: COLORS.TEXT.SECONDARY }}>
              {grade.student?.code}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'value',
      title: 'Calificación',
      width: 150,
      render: (value: number, grade: Grade) => (
        <input
          type="number"
          min={ACADEMIC.GRADING_SCALE.MIN}
          max={ACADEMIC.GRADING_SCALE.MAX}
          step="0.1"
          value={value || ''}
          onChange={(e) => handleGradeChange(grade.studentId, Number(e.target.value))}
          style={{
            width: '80px',
            padding: SPACING.SM,
            border: `1px solid ${COLORS.GREY[300]}`,
            borderRadius: '4px',
            textAlign: 'center',
            ...(value < ACADEMIC.GRADING_SCALE.PASS_THRESHOLD && {
              color: COLORS.ERROR.MAIN,
              borderColor: COLORS.ERROR.MAIN,
            }),
          }}
        />
      ),
    },
    {
      key: 'status',
      title: 'Estado',
      width: 120,
      render: (value: number) => (
        <span
          style={{
            padding: `${SPACING.XS}px ${SPACING.SM}px`,
            backgroundColor:
              value >= ACADEMIC.GRADING_SCALE.PASS_THRESHOLD
                ? `${COLORS.SUCCESS.LIGHT}20`
                : `${COLORS.ERROR.LIGHT}20`,
            color:
              value >= ACADEMIC.GRADING_SCALE.PASS_THRESHOLD
                ? COLORS.SUCCESS.MAIN
                : COLORS.ERROR.MAIN,
            borderRadius: '16px',
            fontSize: '12px',
          }}
        >
          {value >= ACADEMIC.GRADING_SCALE.PASS_THRESHOLD ? 'Aprobado' : 'Reprobado'}
        </span>
      ),
    },
  ];

  return (
    <Page
      title="Registro de Calificaciones"
      subtitle="Gestión de calificaciones por curso y período"
      loading={coursesLoading || periodsLoading}
    >
      <Form onSubmit={(e) => e.preventDefault()}>
        <div style={{ display: 'flex', gap: SPACING.MD, marginBottom: SPACING.LG }}>
          <FormField label="Curso">
            <Select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              options={
                courses?.map((course) => ({
                  label: course.name,
                  value: course.id,
                })) || []
              }
            />
          </FormField>

          <FormField label="Período">
            <Select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              options={
                periods?.map((period) => ({
                  label: period.name,
                  value: period.id,
                })) || []
              }
            />
          </FormField>
        </div>
      </Form>

      {selectedCourse && selectedPeriod ? (
        <DataTable
          data={grades}
          columns={columns}
          loading={gradesLoading}
        />
      ) : (
        <div
          style={{
            padding: SPACING.XL,
            textAlign: 'center',
            color: COLORS.TEXT.SECONDARY,
          }}
        >
          Selecciona un curso y un período para ver las calificaciones
        </div>
      )}
    </Page>
  );
};

export default GradesPage;