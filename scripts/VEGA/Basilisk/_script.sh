#!/bin/bash
#SBATCH --job-name=job
#SBATCH --output=job.out
#SBATCH --error=job.err
#SBATCH --account=%account%
#SBATCH --partition=%partition%
#SBATCH --nodes=%nodes%

#MODULES BEGIN VEGA Basilisk
module purge
ml load Bison/3.7.1-GCCcore-10.2.0 CMake/3.18.4-GCCcore-10.2.0 Python/3.8.6-GCCcore-10.2.0 flex/2.6.4-GCCcore-10.2.0 SWIG/4.0.2-GCCcore-10.3.0 Mesa/20.2.1-GCCcore-10.2.0 libGLU/9.0.1-GCCcore-10.2.0 OpenMPI/4.1.3-GCC-10.3.0 ImageMagick/7.0.10-35-GCCcore-10.2.0 FFmpeg/4.4.2-GCCcore-11.3.0
#MODULES END

source your/env_path/bin/activate

srun --mpi=pmix %executable%
