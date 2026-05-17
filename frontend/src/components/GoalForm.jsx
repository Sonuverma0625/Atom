import React, { useState } from 'react';
import axios from 'axios';

const GoalForm = ({ user, onGoalAdded, onCancel, currentGoals, goalToEdit }) => {
  const [title, setTitle] = useState(goalToEdit ? goalToEdit.title : '');
  const [description, setDescription] = useState(goalToEdit ? goalToEdit.description : '');
  const [uom, setUom] = useState(goalToEdit ? goalToEdit.uom : 'Numeric');
  const [target, setTarget] = useState(goalToEdit ? goalToEdit.target.toString() : '');
  const [weightage, setWeightage] = useState(goalToEdit ? goalToEdit.weightage.toString() : '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Exclude current goal if we are editing it, so we don't double-count its weightage
  const otherGoals = goalToEdit ? currentGoals.filter(g => g.id !== goalToEdit.id) : currentGoals;
  const currentWeightage = otherGoals.reduce((sum, g) => sum + g.weightage, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!goalToEdit && currentGoals.length >= 8) {
      setError('You cannot have more than 8 goals.');
      return;
    }

    const weight = parseFloat(weightage);
    if (weight < 10) {
      setError('Minimum weightage per individual goal is 10%.');
      return;
    }

    if (currentWeightage + weight > 100) {
      setError(`Adding this goal exceeds the 100% total weightage. Current total of other goals: ${currentWeightage}%, Remaining: ${100 - currentWeightage}%`);
      return;
    }

    setLoading(true);
    try {
      if (goalToEdit) {
        const response = await axios.patch(`/api/goals/${goalToEdit.id}`, {
          title,
          description,
          uom,
          target,
          weightage: weight,
          status: 'Pending Approval' // Reset status to trigger manager review
        });
        onGoalAdded(response.data);
      } else {
        const response = await axios.post('/api/goals', {
          title,
          description,
          uom,
          target,
          weightage: weight,
          ownerId: user.id
        });
        onGoalAdded(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save goal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto', border: '1px solid var(--primary-color)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3>{goalToEdit ? 'Edit Goal' : 'Create New Goal'}</h3>
        <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.2)', color: 'var(--primary-color)' }}>
          Weightage Available: {100 - currentWeightage}%
        </span>
      </div>

      {error && (
        <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid var(--danger)', color: 'var(--danger)', marginBottom: '20px', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Goal Title / Thrust Area</label>
          <input 
            type="text" 
            className="input-field" 
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            placeholder="e.g., Increase Q3 Sales Revenue"
          />
        </div>

        <div className="input-group">
          <label>Description</label>
          <textarea 
            className="input-field" 
            rows="3"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            placeholder="Detailed description of what needs to be achieved..."
          ></textarea>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="input-group">
            <label>Unit of Measurement (UoM)</label>
            <select 
              className="input-field"
              value={uom}
              onChange={e => setUom(e.target.value)}
            >
              <option value="Numeric">Min (Numeric/%)</option>
              <option value="Max">Max (Numeric/%)</option>
              <option value="Timeline">Timeline (Date)</option>
              <option value="Zero">Zero-based</option>
            </select>
          </div>

          <div className="input-group">
            <label>Target Value</label>
            <input 
              type="number" 
              step="0.01"
              className="input-field" 
              value={target}
              onChange={e => setTarget(e.target.value)}
              required
              placeholder="e.g., 500000"
            />
          </div>
        </div>

        <div className="input-group">
          <label>Weightage (%) - Min 10%</label>
          <input 
            type="number" 
            min="10"
            max="100"
            className="input-field" 
            value={weightage}
            onChange={e => setWeightage(e.target.value)}
            required
            placeholder="e.g., 20"
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
            {loading ? 'Saving...' : goalToEdit ? 'Save Changes' : 'Submit Goal for Approval'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default GoalForm;
