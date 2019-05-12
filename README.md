## gRT - Mood Disorders Lab Webgazer eyetracking task
-------------------------------------------------------------------------------------------------

<div class="row">
	<a href="https://liberalarts.utexas.edu/imhr/">
		<img src="https://risoms.github.io/mdl/docs/source/_static/img/imhr-header.png" height="auto" width="100%" max-width="400px">
	</a>
<div>

-----------------------------------------------------------------------------------------------

mdl-webgazer
------------

### versions
* gRT: 1
	* date: 2018-07-03 to 2018-08-23 and
	* date: 2018-08-23 to 2019-06-01
	* differences from previous version: 
		* calibration occuring in each block
		* updated version of webgazer
		* code clean-up

### design
#### trial
* fixation: 0-1500ms (1500)
* facestim: 1500-4500ms (3000)
* dotloc: 4250-14250ms (10000)
* delay: 14250-14500ms (250)

#### task
* nine blocks of 198 trials
* two conditions (subject does same version each time): 
	* active training:
		-- probe [target] 80% neutral stim location
		-- probe [target] 20% dysphoric [sad] stim location
	* placebo:
		-- probe [target] 50% neutral stim location
		-- probe [target] 50% dysphoric [sad] stim location

#### structure
* 198-trials (total), 9-blocks, 22-trials [12 - pofa; 10*9 - iaps]
* minimal duration: 17 minutes + 4 minute break + 5 minute practice
	** (12 pofa_trials * 9 blocks * (4.5 second stim) +
	** (10 iaps_trials * 9 blocks * (6 second trial))
* maxinum duration: 50 minutes [include max response time]: 17 minutes + 4 minute break + 5 minute practice
	** (12 pofa_trials * 9 blocks * (4.5 second stim + 10 second response) + 
	** (10 iaps_trials * 9 blocks * (6 second trial + 10 second response))

```
gRT
├── Practice
│	├── IAPS
│	│	├── Fixation: 1500msec
│	│	├── Stimulus: 4500msec
│	│	├── Probe: User defined 
│	├── POFA
│	│	├── Fixation: 1500msec
│	│	├── Stimulus: 3000msec
│	│	├── Probe: User defined
├── Task
│	├── Block 1: 20 trials
│	│	├── POFA: 12 trials
│	│	├── IAPS: 10 trials
│	├── Block 2
│	├── Block 3
│	├── Break: 2 minutes
│	├── Block 4 
│	├── Block 5
│	├── Block 6
│	├── Break: 2 minutes
│	├── Block 7
│	├── Block 8
│	├── Block 9
```