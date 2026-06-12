"""integration tests for the coldfront_plugin_slurmrest plugin"""


# test to confirm that the command "slurm_check" appears in the CLI
def test_slurm_check_command():
    from coldfront_plugin_slurmrest.management.commands.slurm_check import Command

    assert hasattr(Command, "handle"), (
        "Command 'slurm_check' should have a 'handle' method"
    )
