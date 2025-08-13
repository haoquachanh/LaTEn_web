/**
 * Examination Preset Form Component
 *
 * Component để hiển thị và chọn các bài thi mẫu (preset exams)
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { AccessTime, QueryBuilder, School, Category, Settings } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { PresetExam } from './types';
import examinationPresetService from '@/services/examination-preset.service';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

interface PresetExamFormProps {
  onSelectPreset?: (preset: PresetExam) => void;
  showPublicOnly?: boolean;
  showUserPresetsOnly?: boolean;
}

// Danh sách các mức độ khó
const difficultyLevels = [
  { value: '', label: 'All Levels' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

export default function PresetExamForm({
  onSelectPreset,
  showPublicOnly = false,
  showUserPresetsOnly = false,
}: PresetExamFormProps) {
  const t = useTranslations('Examination');
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [presets, setPresets] = useState<PresetExam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPreset, setSelectedPreset] = useState<PresetExam | null>(null);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [level, setLevel] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Function to fetch presets based on filters
  const fetchPresets = useCallback(async () => {
    setLoading(true);
    try {
      let response;
      const params = {
        page,
        limit: 9, // Show 9 cards per page
        search: search || undefined,
        level: level || undefined,
      };

      if (showPublicOnly) {
        // Fetch only public presets
        response = await examinationPresetService.getPublicPresets(params);
      } else if (showUserPresetsOnly && user) {
        // Fetch only user's presets
        response = await examinationPresetService.getMyPresets(params);
      } else {
        // Fetch all presets the user can access
        response = await examinationPresetService.getPresets(params);
      }

      setPresets(response.data);
      setTotalPages(Math.ceil(response.meta.total / 9));
    } catch (error) {
      console.error('Error fetching presets:', error);
      showToast('Error loading examination presets', 'error');
      // Fallback to sample data in development for testing
      if (process.env.NODE_ENV === 'development') {
        setPresets(samplePresetExams);
      }
    } finally {
      setLoading(false);
    }
  }, [page, search, level, showPublicOnly, showUserPresetsOnly, user, showToast]);

  // Fetch presets on component mount and when filters change
  useEffect(() => {
    fetchPresets();
  }, [fetchPresets]);

  // Handle preset selection
  const handleSelectPreset = (preset: PresetExam) => {
    setSelectedPreset(preset);
    setConfirmOpen(true);
  };

  // Handle confirmation dialog close
  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };

  // Handle starting the examination
  const handleStartExam = async () => {
    if (!selectedPreset) return;

    setConfirmOpen(false);

    if (onSelectPreset) {
      onSelectPreset(selectedPreset);
      return;
    }

    try {
      const examination = await examinationPresetService.startExamination(selectedPreset.id);
      router.push(`/examination/${examination.id}`);
    } catch (error) {
      console.error('Error starting examination:', error);
      showToast('Failed to start examination', 'error');
    }
  };

  // Handle page change
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1); // Reset to first page on search
  };

  // Handle level filter change
  const handleLevelChange = (event: React.ChangeEvent<HTMLInputElement> | { target: { value: unknown } }) => {
    setLevel(event.target.value as string);
    setPage(1); // Reset to first page on filter change
  };

  // Render preset card
  const renderPresetCard = (preset: PresetExam) => (
    <div className="grid-item" style={{ gridColumn: 'span 4', padding: '8px' }}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
          },
          cursor: 'pointer',
          backgroundColor: preset.isActive ? 'background.paper' : 'action.disabledBackground',
        }}
        onClick={() => preset.isActive && handleSelectPreset(preset)}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" gutterBottom component="div" noWrap>
            {preset.title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, height: '3em', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {preset.description || 'No description provided'}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <AccessTime fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">
              {preset.time} {t('minutes')}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <QueryBuilder fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">
              {preset.totalQuestions} {t('questions')}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <School fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2" textTransform="capitalize">
              {preset.level || 'Medium'} {t('difficulty')}
            </Typography>
          </Box>

          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {preset.type && <Chip label={preset.type} size="small" color="primary" variant="outlined" />}
            {preset.content && <Chip label={preset.content} size="small" color="secondary" variant="outlined" />}
            {!preset.isActive && <Chip label="Inactive" size="small" color="error" />}
          </Box>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Box
        sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}
      >
        <Typography variant="h5" component="h1">
          {showPublicOnly ? t('publicPresets') : showUserPresetsOnly ? t('myPresets') : t('allPresets')}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField label={t('search')} variant="outlined" size="small" value={search} onChange={handleSearchChange} />

          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="level-select-label">{t('level')}</InputLabel>
            <Select labelId="level-select-label" value={level} onChange={handleLevelChange} label={t('level')}>
              {difficultyLevels.map((level) => (
                <MenuItem key={level.value} value={level.value}>
                  {level.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : presets.length > 0 ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
            {presets.map(renderPresetCard)}
          </div>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
          </Box>
        </>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            {t('noPresetsFound')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {search ? t('tryDifferentSearch') : t('noPresetsAvailable')}
          </Typography>
        </Box>
      )}

      <Dialog open={confirmOpen} onClose={handleConfirmClose}>
        <DialogTitle>{t('confirmExamStart')}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{t('startExamConfirmText')}</Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">{selectedPreset?.title}</Typography>
            <Typography variant="body2">{selectedPreset?.description}</Typography>
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2">
                <strong>{t('duration')}:</strong> {selectedPreset?.time} {t('minutes')}
              </Typography>
              <Typography variant="body2">
                <strong>{t('questions')}:</strong> {selectedPreset?.totalQuestions}
              </Typography>
              <Typography variant="body2">
                <strong>{t('difficulty')}:</strong> {selectedPreset?.level || 'Medium'}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose} color="primary">
            {t('cancel')}
          </Button>
          <Button onClick={handleStartExam} color="primary" variant="contained">
            {t('start')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// Sample data for development/testing purposes
const samplePresetExams: PresetExam[] = [
  {
    id: '1',
    title: 'Basic JavaScript Quiz',
    description:
      'Test your fundamental JavaScript knowledge with this quiz covering variables, functions, and basic concepts',
    totalQuestions: 10,
    durationSeconds: 600,
    time: 10,
    questionsCount: 10,
    type: 'multiple-choice',
    content: 'coding',
    level: 'easy',
    isActive: true,
    isPublic: true,
    config: {
      randomize: true,
      showCorrectAnswers: true,
      passingScore: 70,
      resultDisplay: {
        showImmediately: true,
        showCorrectAnswers: true,
        showExplanation: true,
        showScoreBreakdown: true,
      },
    },
    createdAt: '2023-10-20T14:30:00Z',
  },
  {
    id: '2',
    title: 'Advanced React Patterns',
    description: 'Challenge yourself with questions about advanced React patterns, hooks, and optimization techniques',
    totalQuestions: 15,
    durationSeconds: 1800,
    time: 30,
    questionsCount: 15,
    type: 'mixed',
    content: 'coding',
    level: 'hard',
    isActive: true,
    isPublic: true,
    config: {
      randomize: false,
      showCorrectAnswers: false,
      passingScore: 80,
      resultDisplay: {
        showImmediately: false,
        showCorrectAnswers: false,
        showExplanation: true,
        showScoreBreakdown: true,
      },
      security: {
        preventCopy: true,
        preventTabSwitch: true,
        shuffleOptions: true,
      },
    },
    createdAt: '2023-10-18T09:15:00Z',
  },
  {
    id: '3',
    title: 'CSS Layout Mastery',
    description: 'Test your knowledge of CSS layouts including Flexbox, Grid, and responsive design principles',
    totalQuestions: 12,
    durationSeconds: 900,
    time: 15,
    questionsCount: 12,
    type: 'multiple-choice',
    content: 'coding',
    level: 'medium',
    isActive: true,
    isPublic: true,
    createdAt: '2023-10-15T11:20:00Z',
  },
  {
    id: '4',
    title: 'SQL Database Fundamentals',
    description: 'Essential SQL queries, database design, and performance optimization questions',
    totalQuestions: 20,
    durationSeconds: 1200,
    time: 20,
    questionsCount: 20,
    type: 'mixed',
    content: 'database',
    level: 'medium',
    isActive: false,
    isPublic: false,
    createdAt: '2023-10-12T16:45:00Z',
  },
  {
    id: '5',
    title: 'TypeScript Essentials',
    description: 'Cover the fundamentals of TypeScript including types, interfaces, generics, and more',
    totalQuestions: 15,
    durationSeconds: 1500,
    time: 25,
    questionsCount: 15,
    type: 'multiple-choice',
    content: 'coding',
    level: 'medium',
    isActive: true,
    isPublic: true,
    config: {
      randomize: true,
      resultDisplay: {
        showCorrectAnswers: true,
        showExplanation: true,
      },
    },
    createdAt: '2023-10-10T08:30:00Z',
  },
];
