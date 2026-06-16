"""integration tests for the coldfront_plugin_slurmrest plugin"""


# test to confirm that the command "slurm_check" appears in the CLI
def test_slurm_check_command():
    from coldfront.plugins.slurmrest.management.commands.slurmrest_check import Command

    assert hasattr(Command, "handle"), "Command 'slurmrest_check' should have a 'handle' method"
