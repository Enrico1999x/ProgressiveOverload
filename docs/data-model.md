# Data Model

## Goal

This application is an AWS-focused training tracker for experienced lifters.

The data model should support:

- custom training intervals (for example 8-day cycles)
- configurable workout days within a cycle
- workout logging with sets, reps, weight, RIR, and RPE
- exercise-specific notes
- exercise progress analysis
- progressive overload recommendations
- stagnation detection
- a video library per exercise
- comparison of personal form videos with reference/tutorial videos

---

# Core Entities

## User

Represents an application user.

Fields:
- id
- email
- createdAt
- updatedAt

Notes:
- Authentication will later be handled via AWS Cognito
- For now, this model stays minimal

---

## TrainingCycle

Represents a user-defined training cycle.

Examples:
- 8-day Upper/Lower cycle
- 10-day Push/Pull/Legs rotation

Fields:
- id
- userId
- name
- intervalLengthDays
- isActive
- createdAt
- updatedAt

Notes:
- `intervalLengthDays` defines the total cycle length, for example 8
- A user can have multiple cycles, but usually one active cycle

---

## WorkoutDayTemplate

Represents a planned workout day within a training cycle.

Examples:
- Push
- Pull
- Legs
- Upper
- Lower

Fields:
- id
- cycleId
- name
- orderIndex
- createdAt
- updatedAt

Notes:
- `orderIndex` defines the logical order within the cycle
- This is a template, not an actual completed session

---

## Exercise

Represents an exercise that can be used in workouts.

Examples:
- Bench Press
- Incline Dumbbell Press
- Lat Pulldown
- Leg Press

Fields:
- id
- userId
- name
- muscleGroup
- notes
- createdAt
- updatedAt

Notes:
- `notes` stores general exercise-specific notes
- Example: "Keep elbows tucked" or "Use controlled eccentric"
- `userId` can be optional if the app later supports global/shared exercises
- For V1, exercises can still be user-owned

---

## WorkoutSession

Represents an actually performed workout session on a specific date.

Fields:
- id
- userId
- cycleId
- workoutDayTemplateId
- performedAt
- notes
- createdAt
- updatedAt

Notes:
- This stores the real workout instance
- `notes` stores session-level notes
- Example: "Low energy today" or "Shoulder felt unstable"

---

## ExerciseSet

Represents one logged set of an exercise inside a workout session.

Fields:
- id
- sessionId
- exerciseId
- setOrder
- weight
- reps
- rir
- rpe
- createdAt
- updatedAt

Notes:
- This is the most important table for later analytics
- `setOrder` preserves the order of sets
- `rir` = reps in reserve
- `rpe` = rate of perceived exertion
- Either `rir`, `rpe`, both, or neither can be used depending on the user

---

## ProgressRule

Represents progression logic for one exercise.

Fields:
- id
- userId
- exerciseId
- repRangeMin
- repRangeMax
- incrementKg
- createdAt
- updatedAt

Notes:
- This stores the desired rep range for an exercise
- Example:
  - Bench Press: 6 to 8 reps
  - Lateral Raises: 12 to 15 reps
- `incrementKg` defines how much weight should be added when progression criteria are met
- This model is the basis for progressive overload recommendations

---

## ExerciseVideo

Represents a video associated with an exercise.

This can either be:
- a personal form video uploaded by the user
- a reference/tutorial video from an external source

Fields:
- id
- exerciseId
- userId
- type
- title
- description
- videoUrl
- thumbnailUrl
- sourcePlatform
- sourceLink
- createdAt
- updatedAt

Notes:
- `type` can be:
  - `user_form`
  - `reference`
- `videoUrl` is used for uploaded/internal videos
- `sourceLink` is used for external videos such as TikTok or YouTube
- `sourcePlatform` can be:
  - `upload`
  - `tiktok`
  - `youtube`
  - `instagram`
  - `other`
- This model supports a video library per exercise
- The side-by-side comparison is a frontend feature and does not require its own database table in V1

---

# Relationships

## User relationships
- A user can have many training cycles
- A user can have many workout sessions
- A user can have many progress rules
- A user can have many exercise videos
- A user can create many exercises

## Training cycle relationships
- A training cycle belongs to one user
- A training cycle can have many workout day templates
- A training cycle can have many workout sessions

## Workout day template relationships
- A workout day template belongs to one training cycle
- A workout day template can be referenced by many workout sessions

## Workout session relationships
- A workout session belongs to one user
- A workout session belongs to one training cycle
- A workout session belongs to one workout day template
- A workout session can have many exercise sets

## Exercise relationships
- An exercise can have many exercise sets
- An exercise can have many progress rules
- An exercise can have many exercise videos

## Exercise set relationships
- An exercise set belongs to one workout session
- An exercise set belongs to one exercise

## Progress rule relationships
- A progress rule belongs to one user
- A progress rule belongs to one exercise

## Exercise video relationships
- An exercise video belongs to one user
- An exercise video belongs to one exercise

---

# Design Decisions

## 1. Training cycles are modeled as templates, not as full cycle instances
Reason:
- simpler for V1
- enough for custom interval logic
- real completed workouts are stored in `WorkoutSession`

## 2. Rep ranges are stored in ProgressRule
Reason:
- directly connected to progression logic
- easier to use for overload recommendations

## 3. General exercise notes are stored on Exercise
Reason:
- these notes are persistent and exercise-specific
- session-specific notes are stored on WorkoutSession instead

## 4. Videos are stored separately in ExerciseVideo
Reason:
- one exercise can have multiple videos
- supports both user-uploaded and external reference videos
- keeps exercise metadata clean

## 5. Side-by-side video comparison is handled in the frontend
Reason:
- no extra database structure needed in V1
- user can simply select two videos for comparison in the UI

---

# V1 Scope

The following models are part of V1:
- User
- TrainingCycle
- WorkoutDayTemplate
- Exercise
- WorkoutSession
- ExerciseSet
- ProgressRule
- ExerciseVideo

The following features should be implemented later:
- plateau alert persistence
- fatigue scoring
- deload recommendations
- AI-generated analysis
- automatic form analysis from videos
- synchronized video playback on frame level

---

# Example Use Case

A user creates:
- a training cycle called "Upper Lower 8-Day"
- intervalLengthDays = 8

Within this cycle, the user creates workout day templates:
- Day 1: Upper
- Day 3: Lower
- Day 5: Upper
- Day 7: Lower

The user logs a workout session for "Upper" on a given date.

Inside the session, the user logs sets for Bench Press:
- Set 1: 100 kg x 8 reps
- Set 2: 100 kg x 7 reps
- Set 3: 95 kg x 9 reps

The exercise Bench Press has:
- a general note: "Pause briefly on chest"
- a progress rule: 6 to 8 reps, +2.5 kg increment
- a personal form video
- a reference tutorial video

This allows the app to:
- track performance over time
- visualize progress in charts
- detect stagnation
- recommend overload
- compare form videos with reference videos

---

# Open Questions

These decisions can be refined later:

- Should exercises be global or always user-specific?
- Should progress rules allow different progression methods?
- Should external videos only be linked, or also cached internally later?
- Should exercise notes also exist on set level in the future?
- Should the app support multiple active cycles later?