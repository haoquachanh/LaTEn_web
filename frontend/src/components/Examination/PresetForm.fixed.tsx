/**
 * Create/Edit Preset Examination Form
 *
 * Component để tạo mới hoặc chỉnh sửa examination presets
 */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Divider,
  FormGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  Chip,
  CircularProgress,
  Alert,
  InputAdornment,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  Category as CategoryIcon,
  QuestionMark as QuestionMarkIcon,
  Timer as TimerIcon,
} from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { PresetExam } from './types';
import examinationPresetService, { PresetFormData } from '@/services/examination-preset.service';
import { useToast } from '@/contexts/ToastContext';
import MultiSelect from '@/components/Common/MultiSelect';

// Props interface
interface PresetFormProps {
  preset?: PresetExam;
  onSave?: (preset: PresetExam) => void;
  onCancel?: () => void;
  isEdit?: boolean;
}

// Component
export default function PresetForm({ preset, onSave, onCancel, isEdit = false }: PresetFormProps) {
  const t = useTranslations('Examination');
  const { showToast } = useToast();

  // Form state
  const [formData, setFormData] = useState<PresetFormData>({
    title: '',
    description: '',
    type: 'multiple-choice',
    content: 'reading',
    level: 'medium',
    totalQuestions: 10,
    durationSeconds: 600,
    isActive: true,
    isPublic: false,
    config: {
      randomize: false,
      showCorrectAnswers: true,
      passingScore: 70,
      resultDisplay: {
        showImmediately: true,
        showCorrectAnswers: true,
        showExplanation: true,
        showScoreBreakdown: true,
      },
      security: {
        preventCopy: false,
        preventTabSwitch: false,
        timeoutWarning: 5,
        shuffleOptions: false,
      },
    },
  });

  // UI states
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  // Initialize form if editing existing preset
  useEffect(() => {
    if (preset && isEdit) {
      setFormData({
        title: preset.title,
        description: preset.description || '',
        type: preset.type || 'multiple-choice',
        content: preset.content || 'reading',
        level: preset.level || 'medium',
        totalQuestions: preset.totalQuestions,
        durationSeconds: preset.durationSeconds,
        isActive: preset.isActive,
        isPublic: preset.isPublic || false,
        config: preset.config || {
          randomize: false,
          showCorrectAnswers: true,
          passingScore: 70,
          resultDisplay: {
            showImmediately: true,
            showCorrectAnswers: true,
            showExplanation: true,
            showScoreBreakdown: true,
          },
          security: {
            preventCopy: false,
            preventTabSwitch: false,
            timeoutWarning: 5,
            shuffleOptions: false,
          },
        },
      });

      // If the preset has questions, load them
      if (preset.questions && Array.isArray(preset.questions) && preset.questions.length > 0) {
        // Extract question IDs if they're objects
        const questionIds = preset.questions.map((q) => (typeof q === 'object' ? q.id : q));
        setSelectedQuestions(questionIds);
      }
    }

    // Load questions and categories
    fetchQuestionsAndCategories();
  }, [preset, isEdit]);

  // Fetch questions and categories
  const fetchQuestionsAndCategories = async () => {
    try {
      // These API calls should be implemented in your services
      // For now, we'll use placeholder data
      setQuestions(sampleQuestions);
      setCategories(sampleCategories);
    } catch (error) {
      console.error('Error fetching questions or categories:', error);
      setError('Failed to load questions or categories');
    }
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name?: string; value: unknown } },
  ) => {
    const { name, value } = e.target;
    if (name) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (name) {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    }
  };

  // Handle configuration changes
  const handleConfigChange = (section: string, field: string, value: any) => {
    setFormData((prev) => {
      // Type-safe implementation
      const updatedConfig = { ...prev.config };
      const sectionKey = section as keyof typeof updatedConfig;

      if (sectionKey === 'resultDisplay') {
        updatedConfig.resultDisplay = {
          ...updatedConfig.resultDisplay,
          [field]: value,
        };
      } else if (sectionKey === 'security') {
        updatedConfig.security = {
          ...updatedConfig.security,
          [field]: value,
        };
      }

      return {
        ...prev,
        config: updatedConfig,
      };
    });
  };

  // Handle simple config changes (not nested)
  const handleSimpleConfigChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      config: {
        ...prev.config,
        [field]: value,
      },
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Add selected questions and categories to the form data
      const submitData: PresetFormData = {
        ...formData,
        questionIds: selectedQuestions.length > 0 ? selectedQuestions : undefined,
        categoryIds: selectedCategories.length > 0 ? selectedCategories : undefined,
      };

      let savedPreset: PresetExam;

      if (isEdit && preset) {
        // Update existing preset
        savedPreset = await examinationPresetService.updatePreset(preset.id, submitData);
        showToast('Examination preset updated successfully', 'success');
      } else {
        // Create new preset
        savedPreset = await examinationPresetService.createPreset(submitData);
        showToast('Examination preset created successfully', 'success');
      }

      setSuccess(true);

      // Call onSave callback if provided
      if (onSave) {
        onSave(savedPreset);
      }
    } catch (error) {
      console.error('Error saving preset:', error);
      setError('Failed to save examination preset');
      showToast('Failed to save examination preset', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component={Paper} sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        {isEdit ? t('editPreset') : t('createPreset')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {isEdit ? t('presetUpdated') : t('presetCreated')}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
          {/* Basic Information */}
          <div style={{ gridColumn: 'span 12' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {t('basicInformation')}
            </Typography>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '16px' }}>
              <div style={{ gridColumn: 'span 12' }}>
                <TextField
                  name="title"
                  label={t('title')}
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  fullWidth
                />
              </div>

              <div style={{ gridColumn: 'span 12' }}>
                <TextField
                  name="description"
                  label={t('description')}
                  value={formData.description}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                  fullWidth
                />
              </div>

              <div style={{ gridColumn: 'span 6' }}>
                <FormControl fullWidth>
                  <InputLabel id="type-label">{t('type')}</InputLabel>
                  <Select
                    labelId="type-label"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    label={t('type')}
                  >
                    <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
                    <MenuItem value="true-false">True/False</MenuItem>
                    <MenuItem value="essay">Essay</MenuItem>
                    <MenuItem value="mixed">Mixed</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <div style={{ gridColumn: 'span 6' }}>
                <FormControl fullWidth>
                  <InputLabel id="content-label">{t('content')}</InputLabel>
                  <Select
                    labelId="content-label"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    label={t('content')}
                  >
                    <MenuItem value="reading">Reading</MenuItem>
                    <MenuItem value="coding">Coding</MenuItem>
                    <MenuItem value="listening">Listening</MenuItem>
                    <MenuItem value="mixed">Mixed</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <div style={{ gridColumn: 'span 6' }}>
                <FormControl fullWidth>
                  <InputLabel id="level-label">{t('level')}</InputLabel>
                  <Select
                    labelId="level-label"
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    label={t('level')}
                  >
                    <MenuItem value="easy">Easy</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="hard">Hard</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <div style={{ gridColumn: 'span 6' }}>
                <TextField
                  name="durationSeconds"
                  label={t('duration')}
                  type="number"
                  value={formData.durationSeconds}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  InputProps={{
                    endAdornment: <InputAdornment position="end">seconds</InputAdornment>,
                  }}
                  helperText={`${Math.floor(formData.durationSeconds / 60)} minutes`}
                  inputProps={{ min: 60 }}
                />
              </div>

              <div style={{ gridColumn: 'span 6' }}>
                <FormControlLabel
                  control={
                    <Switch
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleCheckboxChange}
                      color="primary"
                    />
                  }
                  label={t('active')}
                />
              </div>

              <div style={{ gridColumn: 'span 6' }}>
                <FormControlLabel
                  control={
                    <Switch
                      name="isPublic"
                      checked={formData.isPublic}
                      onChange={handleCheckboxChange}
                      color="primary"
                    />
                  }
                  label={t('public')}
                />
              </div>
            </div>
          </div>

          {/* Questions Selection */}
          <div style={{ gridColumn: 'span 12' }}>
            <Divider sx={{ my: 2 }} />

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <QuestionMarkIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">{t('questionSelection')}</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '16px' }}>
                  <div style={{ gridColumn: 'span 12' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {t('selectQuestionsHelp')}
                    </Typography>
                  </div>

                  <div style={{ gridColumn: 'span 12' }}>
                    <MultiSelect
                      label={t('selectQuestions')}
                      options={questions.map((q) => ({
                        value: q.id,
                        label: `${q.content.substring(0, 60)}${q.content.length > 60 ? '...' : ''}`,
                      }))}
                      value={selectedQuestions}
                      onChange={(values) => setSelectedQuestions(values as number[])}
                    />
                  </div>

                  <div style={{ gridColumn: 'span 12', marginTop: '16px' }}>
                    <Typography variant="body2">{t('or')}</Typography>
                  </div>

                  <div style={{ gridColumn: 'span 12' }}>
                    <MultiSelect
                      label={t('selectCategories')}
                      options={categories.map((c) => ({
                        value: c.id,
                        label: c.name,
                      }))}
                      value={selectedCategories}
                      onChange={(values) => setSelectedCategories(values as number[])}
                    />
                  </div>

                  <div style={{ gridColumn: 'span 6' }}>
                    <TextField
                      name="totalQuestions"
                      label={t('totalQuestions')}
                      type="number"
                      value={formData.totalQuestions}
                      onChange={handleInputChange}
                      required
                      fullWidth
                      inputProps={{ min: 1 }}
                    />
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
          </div>

          {/* Result Display Configuration */}
          <div style={{ gridColumn: 'span 12' }}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <VisibilityIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">{t('resultDisplaySettings')}</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '16px' }}>
                  <div style={{ gridColumn: 'span 12' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {t('configureResultDisplayHelp')}
                    </Typography>
                  </div>

                  <div style={{ gridColumn: 'span 12' }}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.config?.resultDisplay?.showImmediately || false}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleConfigChange('resultDisplay', 'showImmediately', e.target.checked)
                            }
                          />
                        }
                        label={t('showResultsImmediately')}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.config?.resultDisplay?.showCorrectAnswers || false}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleConfigChange('resultDisplay', 'showCorrectAnswers', e.target.checked)
                            }
                          />
                        }
                        label={t('showCorrectAnswers')}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.config?.resultDisplay?.showExplanation || false}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleConfigChange('resultDisplay', 'showExplanation', e.target.checked)
                            }
                          />
                        }
                        label={t('showExplanations')}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.config?.resultDisplay?.showScoreBreakdown || false}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleConfigChange('resultDisplay', 'showScoreBreakdown', e.target.checked)
                            }
                          />
                        }
                        label={t('showScoreBreakdown')}
                      />
                    </FormGroup>
                  </div>

                  <div style={{ gridColumn: 'span 6' }}>
                    <TextField
                      label={t('passingScore')}
                      type="number"
                      value={formData.config?.passingScore || 70}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleSimpleConfigChange('passingScore', Number(e.target.value))
                      }
                      fullWidth
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                      inputProps={{ min: 0, max: 100 }}
                    />
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
          </div>

          {/* Security Settings */}
          <div style={{ gridColumn: 'span 12' }}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SecurityIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">{t('securitySettings')}</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '16px' }}>
                  <div style={{ gridColumn: 'span 12' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {t('configureSecurityHelp')}
                    </Typography>
                  </div>

                  <div style={{ gridColumn: 'span 12' }}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.config?.security?.preventCopy || false}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleConfigChange('security', 'preventCopy', e.target.checked)
                            }
                          />
                        }
                        label={t('preventCopy')}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.config?.security?.preventTabSwitch || false}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleConfigChange('security', 'preventTabSwitch', e.target.checked)
                            }
                          />
                        }
                        label={t('preventTabSwitch')}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.config?.security?.shuffleOptions || false}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleConfigChange('security', 'shuffleOptions', e.target.checked)
                            }
                          />
                        }
                        label={t('shuffleOptions')}
                      />
                    </FormGroup>
                  </div>

                  <div style={{ gridColumn: 'span 6' }}>
                    <TextField
                      label={t('timeoutWarning')}
                      type="number"
                      value={formData.config?.security?.timeoutWarning || 5}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleConfigChange('security', 'timeoutWarning', Number(e.target.value))
                      }
                      fullWidth
                      InputProps={{
                        endAdornment: <InputAdornment position="end">minutes</InputAdornment>,
                      }}
                      inputProps={{ min: 0, max: 60 }}
                      helperText={t('timeoutWarningHelp')}
                    />
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
          </div>

          {/* Advanced Settings */}
          <div style={{ gridColumn: 'span 12' }}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SettingsIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">{t('advancedSettings')}</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '16px' }}>
                  <div style={{ gridColumn: 'span 12' }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.config?.randomize || false}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleSimpleConfigChange('randomize', e.target.checked)
                          }
                        />
                      }
                      label={t('randomizeQuestions')}
                    />
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
          </div>

          {/* Submit Buttons */}
          <div
            style={{
              gridColumn: 'span 12',
              marginTop: '24px',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '16px',
            }}
          >
            {onCancel && (
              <Button variant="outlined" onClick={onCancel} disabled={loading}>
                {t('cancel')}
              </Button>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
              disabled={loading}
            >
              {isEdit ? t('updatePreset') : t('createPreset')}
            </Button>
          </div>
        </div>
      </Box>
    </Box>
  );
}

// Sample data for development
const sampleQuestions = [
  { id: 1, content: 'What is the capital of France?', type: 'multiple_choice' },
  { id: 2, content: 'Which keyword is used to declare a variable in JavaScript?', type: 'multiple_choice' },
  { id: 3, content: 'What does HTML stand for?', type: 'multiple_choice' },
  { id: 4, content: 'What is the correct way to create a function in JavaScript?', type: 'multiple_choice' },
  { id: 5, content: 'Which CSS property is used to change the text color?', type: 'multiple_choice' },
];

const sampleCategories = [
  { id: 1, name: 'HTML' },
  { id: 2, name: 'CSS' },
  { id: 3, name: 'JavaScript' },
  { id: 4, name: 'React' },
  { id: 5, name: 'Node.js' },
];
