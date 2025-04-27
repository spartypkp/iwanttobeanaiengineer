-- Simplified function to delete all conversations for a specific Sanity documentId
CREATE OR REPLACE FUNCTION reset_document_conversations(p_document_id TEXT)
RETURNS INTEGER AS
$$
DECLARE
    v_deleted_count INTEGER;
BEGIN
    -- Delete conversations matching the documentId
    -- Cascade will automatically delete related messages, tool calls, and analytics
    DELETE FROM conversations 
    WHERE context::jsonb ? 'documentId' 
    AND context::jsonb ->> 'documentId' = p_document_id;
    
    -- Get number of rows affected
    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    
    -- Return number of conversations deleted
    RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Example usage:
-- SELECT reset_document_conversations('your-document-id-here'); 