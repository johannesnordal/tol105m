#!/bin/bash
#SBATCH --job-name=job
#SBATCH --output=job.out
#SBATCH --error=job.err
#SBATCH --account=%account%
#SBATCH --partition=%partition%
#SBATCH --nodes=%nodes%

#MODULES BEGIN cyclone basilisk
module purge
ml load SWIG/4.0.2-GCCcore-10.2.0 Bison/3.7.1-GCCcore-10.2.0 CMake/3.18.4-GCCcore-10.2.0 Python/3.8.6-GCCcore-10.2.0 flex/2.6.4-GCCcore-10.2.0 glew/2.2.0-GCCcore-10.2.0-osmesa Mesa/20.2.1-GCCcore-10.2.0 libGLU/9.0.1-GCCcore-10.2.0 OpenMPI/4.0.5-GCC-10.2.0
#MODULES END

source your/env_path/bin/activate

srun --exclusive %executable%
