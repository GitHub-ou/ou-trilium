import Component from "../widgets/component.js";
import appContext from "./app_context.js";
import dateNoteService from "../services/date_notes.js";
import treeService from "../services/tree.js";
import openService from "./open.js";

export default class RootCommandExecutor extends Component {
    jumpToNoteCommand() {
        import("../dialogs/jump_to_note.js").then(d => d.showDialog());
    }

    showRecentChangesCommand() {
        import("../dialogs/recent_changes.js").then(d => d.showDialog());
    }

    showNoteInfoCommand() {
        import("../dialogs/note_info.js").then(d => d.showDialog());
    }

    showNoteRevisionsCommand() {
        import("../dialogs/note_revisions.js").then(d => d.showCurrentNoteRevisions());
    }

    showNoteSourceCommand() {
        import("../dialogs/note_source.js").then(d => d.showDialog());
    }

    showLinkMapCommand() {
        import("../dialogs/link_map.js").then(d => d.showDialog());
    }

    pasteMarkdownIntoTextCommand() {
        import("../dialogs/markdown_import.js").then(d => d.importMarkdownInline());
    }

    async editBranchPrefixCommand() {
        const notePath = appContext.tabManager.getActiveTabNotePath();

        if (notePath) {
            const editBranchPrefixDialog = await import("../dialogs/branch_prefix.js");
            editBranchPrefixDialog.showDialog(notePath);
        }
    }

    async cloneNoteIdsToCommand({noteIds}) {
        const d = await import("../dialogs/clone_to.js");
        d.showDialog(noteIds);
    }

    async moveBranchIdsToCommand({branchIds}) {
        const d = await import("../dialogs/move_to.js");
        d.showDialog(branchIds);
    }

    showOptionsCommand() {
        import("../dialogs/options.js").then(d => d.showDialog());
    }

    showHelpCommand() {
        import("../dialogs/help.js").then(d => d.showDialog());
    }

    async showSQLConsoleCommand() {
        const sqlConsoleNote = await dateNoteService.createSqlConsole();

        const tabContext = await appContext.tabManager.openTabWithNote(sqlConsoleNote.noteId, true);

        appContext.triggerEvent('focusOnDetail', {tabId: tabContext.tabId});
    }

    async searchNotesCommand({searchString, ancestorNoteId}) {
        const searchNote = await dateNoteService.createSearchNote({searchString, ancestorNoteId});

        const tabContext = await appContext.tabManager.openTabWithNote(searchNote.noteId, true);

        appContext.triggerCommand('focusOnSearchDefinition', {tabId: tabContext.tabId});
    }

    async searchInSubtreeCommand({notePath}) {
        const noteId = treeService.getNoteIdFromNotePath(notePath);

        this.searchNotesCommand({ancestorNoteId: noteId});
    }

    showBackendLogCommand() {
        import("../dialogs/backend_log.js").then(d => d.showDialog());
    }

    openNoteExternallyCommand() {
        const noteId = appContext.tabManager.getActiveTabNoteId();

        if (noteId) {
            openService.openNoteExternally(noteId);
        }
    }
}
