#SBATCH --account=%account%
#SBATCH --partition=%partition%
#SBATCH --nodes=%nodes%

srun %executable%
