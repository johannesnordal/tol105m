#!/bin/bash
#SBATCH --job-name=job
#SBATCH --output=job.out
#SBATCH --error=job.err
#SBATCH --account=%account%
#SBATCH --partition=%partition%
#SBATCH --nodes=%nodes%
#BATCH  --gpus-per-node=4
#SBATCH --ntasks-per-node=4

#MODULES BEGIN cyclone horovod
module purge
ml load h5py tqdm matplotlib PyTorch/1.9.1-fosscuda-2020b Horovod/0.22.0-fosscuda-2020b-PyTorch-1.9.1
#MODULES END

source your/env_path/bin/activate

# Horovod NCCL/MPI setup
srun --cpu-bind=none python3 -u %executable%
